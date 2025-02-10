//This is how data should look going into the React component blocks
export const data = [
    //All info
    {
        id : 1,
        title : "Super cool BG swap animation (With creator defined statement)", //Required
        author : "SuperCoolMan", //Can be null
        files : [ //Required at least 1 file
            {
                filename : "test.rpy",
                code: "label bgswaptesttttt:\n bgswap bg school hallway_1 day begin",
                lmodified : 1738761322559 //File Modified Date (Auto generated)
            },
            {
                filename : "01ETMstatements.rpy",
                code: `def parse_set_global_default_expression(lex):\n    face_code = lex.word()\n    if not lex.eol():\n        face_code += " " + lex.word()\n    return face_code\ndef execute_set_global_default_expression(face_code):\n    emo_dict = getattr(renpy.store, "EMRDict")\n    emo_dict.set_global_default_expression(face_code)\n\ndef lint_set_global_default_expression(face_code):\n    check_emotion(face_code)\n\nrenpy.register_statement("bgswap",\n    parse=parse_set_global_default_expression,\n    execute=execute_set_global_default_expression,\n    lint=lint_set_global_default_expression\n)`,
                lmodified : 1738769892559 //File Modified Date (Auto generated)
            },
        ],
        catagory : "Animation", //Backend, Frontend, Renpy, python
        tags : ["Creator Defined Statements", "Multiple Files"], //Like categories but you can add more to make it easier to search
        description : "The 01ETMStatements contains the setup for the creator defined statement, which can be modified to suit you needs and test.rpy contains a label that has the proper code ot activate it",
        // cookieId : "b2796986-78be-4701-9387-5db7d7b96a73",
        cdate: 1738761322559 //Creation Date (Auto generated)
    },
    //Just enough info
    {
        id : 2,
        title : "The Incredible Allison", //Required
        author : undefined, //Can be null
        files : [ //Required at least 1 file
            {
                filename : "test.rpy", //Force them to fill this out on the creation page
                //Or give it a default name. Maybe that updates with the title, so they want to change it
                code: `label bgswaptesttttt:\nshow allison a_0 at center:\n    matrixcolor TintMatrix("#9A1")`,
                lmodified : 1731769892559 //File Modified Date (Auto generated)
            },
        ],
        catagory : undefined, //Backend, Frontend, Renpy, python
        tags : [], //Like categories but you can add more to make it easier to search
        description : undefined,
        // cookieId : "281d5ef6-b2da-4a10-90fb-971eb4e35d32", //Tracks who made the file without being logged in
        //We ignore this for now
        cdate: 1731769892559 //Creation Date (Auto generated)
    }
]

