import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import "react-quill/dist/quill.snow.css";
import { Quill } from "react-quill";
import { fetchData } from "../../../api/axiosService";
const Editor = forwardRef(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const [uploadedImages, setUploadedImages] = useState([]);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement("div")
      );

      const quill = new Quill(editorContainer, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            ["link"],
            ["image"],
            [{ align: "" }, { align: "center" }, { align: "right" }],
            // Add more options for image alignment
            ["imageAlignLeft", "imageAlignRight"],
          ],
        },
      });

      ref.current = quill;

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      const handleImageInsert = async (file) => {
        // Request a presigned URL from the backend
        const response = await fetchData(
          "GET",
          `/api/files/presigned-upload/${file.name}`
        );
        if (response.status != 200) {
          console.error("Failed to fetch presigned URL");
          return;
        }
        const presignedUrl = await response.data;

        // Upload the image to S3 using the presigned URL
        const uploadResponse = await fetch(presignedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!uploadResponse.ok) {
          console.error("Failed to upload image");
          return;
        }

        // Get the S3 URL for the uploaded image
        const fileUrl = presignedUrl.split("?")[0]; // Strip query params to get final S3 URL

        setUploadedImages((prev) => [...prev, fileUrl]);

        // Insert the image into the editor
        const range = quill.getSelection();
        const index = range ? range.index : 0;
        quill.insertEmbed(index, "image", fileUrl);
      };

      const toolbar = quill.getModule("toolbar");
      toolbar.addHandler("image", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();

        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            await handleImageInsert(file);
          }
        };
      });

      // Add custom handlers for text alignment
      toolbar.addHandler("align", (value) => {
        const range = quill.getSelection();
        if (range) {
          quill.format("align", value);
        }
      });

      // Add custom handlers for image alignment
      const alignImageLeft = () => {
        const range = quill.getSelection();
        if (range) {
          quill.format("align", "left");
        }
      };
      const alignImageRight = () => {
        const range = quill.getSelection();
        if (range) {
          quill.format("align", "right");
        }
      };

      // Add custom image alignment buttons to the toolbar
      toolbar.addHandler("imageAlignLeft", alignImageLeft);
      toolbar.addHandler("imageAlignRight", alignImageRight);

      quill.on(Quill.events.TEXT_CHANGE, (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        ref.current = null;
        container.innerHTML = "";
      };
    }, [ref]);

    return <div ref={containerRef}></div>;
  }
);

Editor.displayName = "Editor";

export default Editor;
