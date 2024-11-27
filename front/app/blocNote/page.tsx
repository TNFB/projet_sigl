'use client'
import { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import Home from "@/components/Home";
import "@fortawesome/fontawesome-free/css/all.min.css";

const NotePad = () => {
  const [content, setContent] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
    ],
    content: "<p>Commencez ici...</p>",
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  useEffect(() => {
    const saveContent = () => {
      localStorage.setItem("noteContent", content);
    };

    const interval = setInterval(saveContent, 10000);
    return () => clearInterval(interval);
  }, [content]);

  const setColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
  };

  if (!isClient) {
    return null;
  }

  return (
    <Home>
      <div className="w-full max-w-4xl mx-auto mt-10">
        <div className="flex items-center bg-gray-100 p-4 border-b border-gray-300">
          <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`p-2 mr-2 ${editor?.isActive('bold') ? 'bg-gray-300' : ''}`}>
            <i className="fas fa-bold"></i>
          </button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`p-2 mr-2 ${editor?.isActive('italic') ? 'bg-gray-300' : ''}`}>
            <i className="fas fa-italic"></i>
          </button>
          <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`p-2 mr-2 ${editor?.isActive('underline') ? 'bg-gray-300' : ''}`}>
            <i className="fas fa-underline"></i>
          </button>
          <input type="color" onChange={(e) => setColor(e.target.value)} className="mr-5" />
        </div>
        <div className="editor-container border border-gray-300 rounded-md p-4 bg-white h-96 overflow-y-auto">
          <EditorContent editor={editor} className="h-full"/>
        </div>
      </div>
    </Home>
  );
};

export default NotePad;