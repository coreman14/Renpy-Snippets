## To-do List
- [ ] Add import zip button. It takes a zip folder and adds every RPY it could find to the project.
- [ ] Add Discord embed. I don't know how they work, but it would be cool to have it show all pages
- [ ] Better auth. The auth is currently setup to allow for ease of use rather than data protection.
- [ ] When switching between large files, react-syntax-highlighter does slow down even if you use the lightweight version. Look into the proper way to do something like this
- [ ] If the above goes well, add syntax highlighting to creating as well
- [ ] Custom URLs? I'd like to be able to link an entry and have a vanity link



# Renpy Snippets
A self-hosted Pastebin, that focuses on the Renpy language and adding multiple files to share more complex ideas. Built using Next.js, Drizzle with SQLite, and react-syntax-highlighter.

# Goals
The goal of this project was to include Pastebin's ease of use features, such as anonymous posting and not requiring an account to use the majority of the web UI, while adding features that are important in Renpy, such as multiple files per snippet and automatic indenting features to make writing feel like using an editor, and designed to make finding what you're looking as simple as possible, with each snippet having a description, category and additional tags.

# Deploying
This app can be deployed by cloning this repo, running Next.js locally or using the Dockerfile, which broadcasts on port 3000. In either case, an environment variable `DB_FILE_NAME` must be present, which point drizzle to the DB. If another environment value named `AUTH_TOKEN` is present, it will assume that the connection is a remote connection.

```dosini
#For local database
DB_FILE_NAME=file:local.db

#For remote connections
DB_FILE_NAME=<DATABASE_URL>
DB_FILE_NAME=<AUTH_TOKEN>
```

If you choose to use a file database with docker, make sure you set up a volume so that the information is saved on a hard drive.


