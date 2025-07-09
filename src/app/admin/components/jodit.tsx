import dynamic from "next/dynamic";
import { useRef, useMemo } from "react";

const importJodit = () => import("jodit-react");

const JoditEditor = dynamic(importJodit, {
  ssr: false,
});

interface Props {
  content: string;
  setContent: (content: string) => void;
  label: string;
}

const Jodit = ({ content, setContent, label }: Props) => {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      height: "500px",
      width: "100%",
      removeButtons: ["image", "file", "media"],
      toolbarAdaptive: true,
      toolbarSticky: true,
      style: {
        padding: '0 2rem',
      },
    }),
    []
  );

  return (
    <div className="relative">
      <label>{label}</label>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onChange={(newContent) => setContent(newContent)}
      />
    </div>
  );
};
export default Jodit;
