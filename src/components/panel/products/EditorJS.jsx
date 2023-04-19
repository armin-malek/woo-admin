import React from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";

export default function EditorJS() {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  return (
    <>
      <h1>editor</h1>
      <Editor editorState={editorState} onChange={setEditorState} />
    </>
  );
}
