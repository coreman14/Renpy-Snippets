'use client'
// import SyntaxHighligher from "react-syntax-highlighter"
// import { agate as dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { ChangeEvent, useState } from "react";
import { uploadPost } from "@/app/api";
import { renpyFilesCreateForm } from "@/db/schema";


export default function CreateNewSnippet() {
  //TODO: We need to move this to a component later to make it so that I can implement the edit functionality. 
  //TODO: We need to do a cookie check here to make sure that the user cannot edit someone else work. If they do it should redirect them to the viewing page for it
  //TODO: For addtional tags, we should add a ? button that when you hover will tell you all the things, "Addtional index for search", "You can enter multiple tags by seperating them with commas"
  //TODO: Because I dont want to add extra validation, since all I care about is that the title is entered, we will have to add some CSS for the tab as I have replaced all buttons with spans cause it causes the title to get mad and say it's required
  /*
  Rules for file names.
  1. On first page load the filename is always default.rpy
  2. If the user edits the title first, the RPY file is named based on the title in lowercase + _ instead of spaces.rpy
  ^If the title is New Morph Method, the filename is "new_morph_method.rpy"
  3. These only apply to the first file name, the rest are named "<number>.rpy" so 1.rpy, 2.rpy

  */
  const defaultObject: renpyFilesCreateForm = {filename: "", default_filename: "", code: "label default_label:\n    john 'It's the start of somethign new'", mdate: 0}
  const [files, setFiles] = useState([structuredClone(defaultObject)]);
  const [currentTab, setCurrentTab] = useState(0);
  const uploadPostWithFiles = uploadPost.bind(null, files);
  const updateFilesTitle = function (x: string, ind: number){
    if (!files[ind].filename){
      let default_name = x.toLowerCase().replace(" ", "_")
      if (default_name != ""){
        default_name += ".rpy"
      }
      files[ind].default_filename = default_name

      setFiles(files.concat())
    }
  }
  const createNewFile = function () {
    const newObject = structuredClone(defaultObject);
    let file_name = files.length
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
    setFiles(files.filter((x) => x != files[ind]));
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
    <form action={uploadPostWithFiles}>
    <h1>You are now creating a new snippet</h1>
    <br/>
    <br/>
    <div className="tab">
      {files.map((x, ind) => <span key={ind}><span className={"tablinks" + (currentTab == 0 ? " active" : "")}
      onClick={() => setCurrentTab(ind)}
      >
        {x.filename != "" ? x.filename :  x.default_filename != "" ? x.default_filename : "default.rpy"} 
        </span>
        {files.length > 1 &&<span onClick={() => removeFile(ind)}>x</span>}</span>)}
        <span key="newTab" className="tablinks" onClick={() => createNewFile()}>__++</span>
    </div>
    <div><textarea rows={10} cols={50} className="codePlace text-red-600" value={files[currentTab].code} onInput={(e) => updateCode(e.currentTarget.value, currentTab)} onChange={(e) => typedCode(e)}></textarea>
    {/* <SyntaxHighligher language="renpy" style={dracula}>{files[currentTab].code}</SyntaxHighligher> */}
    {/*TODO: We are gonna ignore the syntax highlighting for now as it's not as seemless as I wanted it to be. Lets get the app working so visual can come later */}
    </div>
    <label htmlFor="title">Title: </label><input type="text" name="title" id="title" onChange={(e) => updateFilesTitle(e.target.value, 0)} required></input><br/><br/>
    <label htmlFor="author">Author: </label><input type="text" name="author" id="author"></input><br/><br/>


    <label htmlFor="catagory">Catagory: </label><input type="text" name="catagory" id="catagory"></input><br/><br/>
    
    <label htmlFor="tags">Additional Tags: </label><input type="text" name="tags" id="tags" placeholder="Use commas to enter multiple tags"></input><br/><br/>
    <label htmlFor="description">Description: </label><textarea name="description" id="description"></textarea><br/><br/>
    <input type="submit"/>
    
    </form>

  );
}
