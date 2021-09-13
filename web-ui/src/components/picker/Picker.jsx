import React from "react";
import "emoji-picker-element";
import "./Picker.css";

const Picker = ({ emojiClicked }) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    ref.current.addEventListener("emoji-click", (event) => {
      console.log("Emoji clicked!", event, event.detail.unicode);
      emojiClicked(event.detail.unicode);
    });
    ref.current.skinToneEmoji = "👍";
    ref.current.style.color = "red";
    let x = ref.current.getElementsByClassName("search-row");
    console.log("current ref", ref.current, x);
    console.log(
      "documentgetelement",
      document.getElementsByClassName("search-row")
    );
    // x[0].style["background-color"] = "red";
  }, []);

  return <emoji-picker class="dark" ref={ref}></emoji-picker>;
  // return React.createElement("emoji-picker", { ref });
};

export default Picker;
