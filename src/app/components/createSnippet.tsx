'use client'
// import SyntaxHighligher from "react-syntax-highlighter"
// import { agate as dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { ChangeEvent, useState } from "react";
import { renpyfilesTable, renpyTable } from "@/db/schema";


export default function CreateOrEditSnippet(props: {
    default_file_object:  (typeof renpyfilesTable.$inferSelect);
    form_action: (files : (typeof renpyfilesTable.$inferSelect)[], formData: FormData) => Promise<void>;
    entry_files: (typeof renpyfilesTable.$inferSelect)[];
    entry?: (typeof renpyTable.$inferSelect);
}) {
  //TODO: We need to do a cookie check here to make sure that the user cannot edit someone else work. If they do it should redirect them to the viewing page for it
  //TODO: For addtional tags, we should add a ? button that when you hover will tell you all the things, "Addtional index for search", "You can enter multiple tags by seperating them with commas"
  //TODO: Because I dont want to add extra validation, since all I care about is that the title is entered, we will have to add some CSS for the tab as I have replaced all buttons with spans cause it causes the title to get mad and say it's required
  const [files, setFiles] = useState(props.entry_files);
  const [currentTab, setCurrentTab] = useState(0);
  const formActionWithFiles = props.form_action.bind(null, files);
  const createNewFile = function () {
    const newObject = structuredClone(props.default_file_object);
    let file_name = files.filter((x) => x.cdate != -1).length
    newObject.filename = file_name + ".rpy"
    while (files.map((x) => x.filename).includes(newObject.filename)){
      file_name++;
      newObject.filename = file_name + ".rpy"
    }
    newObject.code = "" + file_name
    setFiles(files.concat(newObject))
    setCurrentTab(files.length)
  }
  const removeFile = function (ind: number) {
    if (currentTab == ind){
      setCurrentTab(0)
    }
    else{
      setCurrentTab(Math.max(ind - 1, 0))
    }
    if (files[ind].id != -1){ //If the file is linked to the DB
      files[ind].cdate = -1 //Dont show in the file system
      files[ind].snippet_id = -1//Remove from db
      setFiles(files.concat())
    }
    else{//If not, we can just delete it
      setFiles(files.filter((x) => x != files[ind]));
    }
    
  }
  const updateCode = function(x: string, ind: number){
    const newFiles = [...files];
    newFiles[ind].code = x
    newFiles[ind].mdate = new Date().getTime();

    setFiles(newFiles)
  }
  const typedCode = function(e: ChangeEvent){
    return e;
  }
  /*
  TODO: I want to add some comforts to the textarea incase the user chooses to write the code in it.
  The comforts are:
    Tab should insert 4 spaces/whatever is need to make the next multiple instead of changing focus, with shift-tab decreasing the spaces to a multiple of 4
    If enter is pressed right after a ":", we should insert 4 spaces/whatever is need to make the next multiple of 4.
  */
  return (
    <form action={formActionWithFiles}>
    <input type="hidden" name="id" id="id" value={props.entry?.id}></input>
    <h1>You are now editing a snippet</h1>
    <br/>
    <br/>
    <div className="tab">
      {files.map((x, ind) => x.cdate == -1 ? "" : <span key={ind}><span className={"tablinks" + (currentTab == 0 ? " active" : "")}
      onClick={() => setCurrentTab(ind)}
      >
        {x.filename} 
        </span>
        {files.filter((x) => x.cdate != -1).length > 1 &&<span onClick={() => removeFile(ind)}>x</span>}</span>)}
        <span key="newTab" className="tablinks" onClick={() => createNewFile()}>__++</span>
    </div>
    <div><textarea rows={10} cols={50} className="codePlace text-red-600" value={files[currentTab].code} onInput={(e) => updateCode(e.currentTarget.value, currentTab)} onChange={(e) => typedCode(e)}></textarea>
    {/* <SyntaxHighligher language="renpy" style={dracula}>{files[currentTab].code}</SyntaxHighligher> */}
    {/*TODO: We are gonna ignore the syntax highlighting for now as it's not as seemless as I wanted it to be. Lets get the app working so visual can come later */}
    </div>
    <label htmlFor="title">Title: </label><input type="text" name="title" id="title" required defaultValue={props.entry?.title}></input><br/><br/>
    <label htmlFor="author">Author: </label><input type="text" name="author" id="author" defaultValue={props.entry?.author || ""}></input><br/><br/>


    <label htmlFor="catagory">Catagory: </label><input type="text" name="catagory" id="catagory" defaultValue={props.entry?.catagory || ""}></input><br/><br/>
    <label htmlFor="tags">Additional Tags: </label><input type="text" name="tags" id="tags" placeholder="Use commas to enter multiple tags" defaultValue={props.entry?.tags || ""}></input><br/><br/>
    <label htmlFor="description">Description: </label><textarea name="description" id="description" defaultValue={props.entry?.description || ""}></textarea><br/><br/>
    <input type="submit"/>
    
    </form>

  );
}
