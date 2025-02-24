"""Script to process and insert Ren'Py code snippets into a SQLite database."""

import argparse
import os
import random
import sqlite3
from datetime import datetime

import yaml


def check_paths(db_path, search_path):
    """
    Verify that both database and search paths exist.

    Args:
        db_path (str): Path to SQLite database
        search_path (str): Path to search for snippets

    Returns:
        bool: True if both paths exist, False otherwise
    """
    if not os.path.exists(db_path):
        print(f"Database path does not exist: {db_path}")
        return False
    if not os.path.exists(search_path):
        print(f"Search path does not exist: {search_path}")
        return False
    return True


def check_folder_conditions(folder_path):
    """
    Check if folder contains required files and structure.

    Args:
        folder_path (str): Path to check for scenario.yml and story folder

    Returns:
        tuple: (is_valid, yaml_data, rpy_files)
    """
    scenario_path = os.path.join(folder_path, "scenario.yml")
    story_path = os.path.join(folder_path, "story")

    if not os.path.exists(scenario_path) or not os.path.exists(story_path):
        return False, None, []

    # Check for .rpy files in story folder
    rpy_files = []
    for file in os.listdir(story_path):
        if file.endswith(".rpy"):
            rpy_files.append(os.path.join(story_path, file))

    if not rpy_files:
        return False, None, []

    # Read yaml file
    try:
        with open(scenario_path, "r", encoding="utf-8") as f:
            yaml_data = yaml.safe_load(f)
    except (yaml.YAMLError, IOError) as e:
        print(f"Error reading YAML file: {e}")
        return False, None, []

    return True, yaml_data, rpy_files


def read_rpy_files(file_paths):
    """
    Read contents of Ren'Py script files.

    Args:
        file_paths (list): List of paths to .rpy files

    Returns:
        list: List of dictionaries containing filename and code
    """
    contents = []
    for file_path in file_paths:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                contents.append({"filename": os.path.basename(file_path), "code": f.read()})
        except IOError as e:
            print(f"Error reading file {file_path}: {e}")
    return contents


def clear_test_data(cursor):
    """
    Remove all test data entries from database.

    Args:
        cursor: SQLite cursor object

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        cursor.execute("SELECT id FROM renpy_snippet WHERE catagory = 'Test Data'")
        snippet_ids = [row[0] for row in cursor.fetchall()]

        if snippet_ids:
            placeholders = ",".join("?" * len(snippet_ids))
            # Delete related files first (foreign key constraint)
            cursor.execute(
                f"DELETE FROM renpy_snippet_files WHERE snippet_id IN ({placeholders})",
                snippet_ids,
            )
            # Delete snippets
            cursor.execute(f"DELETE FROM renpy_snippet WHERE id IN ({placeholders})", snippet_ids)
        return True
    except sqlite3.Error as e:
        print(f"Error clearing test data: {e}")
        return False


def check_existing_entry(cursor, title):
    """
    Check if an entry with the given title already exists.

    Args:
        cursor: SQLite cursor object
        title (str): Title to check

    Returns:
        bool: True if entry exists, False otherwise
    """
    cursor.execute("SELECT id FROM renpy_snippet WHERE title = ? AND catagory = 'Test Data'", (title,))
    return cursor.fetchone() is not None


def main():
    """Main function to process command line arguments and handle snippet insertion."""
    parser = argparse.ArgumentParser(description="Process Ren'Py snippets and store them in a database.")
    parser.add_argument("db_path", help="Path to the SQLite database")
    parser.add_argument("search_path", help="Path to search for Ren'Py snippets")

    # Create mutually exclusive group for random and offset
    group = parser.add_mutually_exclusive_group()
    group.add_argument("-o", "--offset", type=int, help="Number of valid folders to skip", default=0)
    group.add_argument("-r", "--random", action="store_true", help="Randomly select entries (1 in 5 chance)")

    parser.add_argument("-l", "--limit", type=int, help="Maximum number of entries to add")
    parser.add_argument("-c", "--clear-db", action="store_true", help="Clear existing test data from database")
    parser.add_argument("--cookie", help="Cookie ID to set for new entries")

    args = parser.parse_args()

    if not check_paths(args.db_path, args.search_path):
        return

    try:
        conn = sqlite3.connect(args.db_path)
        cursor = conn.cursor()

        if args.clear_db:
            print("Clearing existing test data...")
            if clear_test_data(cursor):
                conn.commit()
                print("Successfully cleared existing test data")
            else:
                conn.close()
                return

        print("Scanning for valid entries...")
        valid_entries = []
        for root, _, _ in os.walk(args.search_path):
            valid, yaml_data, rpy_files = check_folder_conditions(root)
            if valid and yaml_data:
                valid_entries.append((root, yaml_data, rpy_files))

        print(f"Found {len(valid_entries)} valid entries")

        if args.limit and args.limit > len(valid_entries):
            print(f"Warning: Limit ({args.limit}) is greater than available entries ({len(valid_entries)})")

        valid_folders_processed = 0
        entries_added = 0
        entries_skipped = 0
        attempts = 0
        available_indices = list(range(len(valid_entries)))

        print("\nProcessing entries...")
        while (args.limit is None or entries_added < args.limit) and available_indices:
            # Pick a random entry if random mode is on, otherwise take next in sequence
            if args.random:
                entry_index = random.choice(available_indices)
            else:
                entry_index = available_indices[0]

            root, yaml_data, rpy_files = valid_entries[entry_index]

            # Handle offset
            if args.offset and valid_folders_processed < args.offset:
                valid_folders_processed += 1
                available_indices.remove(entry_index)
                continue

            # Handle random selection
            if args.random:
                attempts += 1
                if random.randint(1, 5) != 1:
                    continue

            # Check for existing entry
            if check_existing_entry(cursor, yaml_data.get("title", "")):
                entries_skipped += 1
                available_indices.remove(entry_index)
                print(f"Skipping duplicate entry: {yaml_data.get('title', '')}")
                continue

            current_time = int(datetime.now().timestamp() * 1000) - random.randint(1000, 500000)
            mtime = current_time + random.randint(1000, 150000)
            title = yaml_data.get("title", "")
            print(f"Adding entry #{entries_added + 1}: {title}")

            cursor.execute(
                """
                INSERT INTO renpy_snippet (title, author, description, catagory, tags, cdate, mdate, cookie_id)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
                (
                    title,
                    yaml_data.get("author", ""),
                    yaml_data.get("description", ""),
                    "Test Data",
                    ",".join(yaml_data.get("tags", [])),
                    current_time,
                    mtime,
                    args.cookie,
                ),
            )

            snippet_id = cursor.lastrowid

            rpy_contents = read_rpy_files(rpy_files)
            for content in rpy_contents:
                cursor.execute(
                    """
                    INSERT INTO renpy_snippet_files (snippet_id, filename, code, cdate, mdate)
                    VALUES (?, ?, ?, ?, ?)
                """,
                    (snippet_id, content["filename"], content["code"], current_time, mtime),
                )

            entries_added += 1
            valid_folders_processed += 1
            available_indices.remove(entry_index)

        conn.commit()
        print("\nFinal Results:")
        print(f"- Entries processed: {entries_added}")
        print(f"- Entries skipped (duplicates): {entries_skipped}")
        print(f"- Total attempts: {attempts}" if args.random else "")
        if args.limit and entries_added < args.limit:
            print(f"Note: Could not reach limit of {args.limit} entries due to exhausting available entries")
        conn.close()

    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return


if __name__ == "__main__":
    main()
