import React, { useEffect, useState, forwardRef, useRef } from "react";
import emojis from "emoji-picker-element-data/en/emojibase/data.json";
import ReactDOM from "react-dom";
import "./PickerList.css";

const PickerButton = ({ emoji, handleEmojiClick, setHoveredEmoji }) => {
  const handleMouseOver = (e) => {
    const position = e.target.getBoundingClientRect();
    console.log("position", position);
    console.log("tooltip", window.innerWidth - position.left);
    setHoveredEmoji({
      top: position.top,
      right: window.innerWidth - position.left,
      shortcode: emoji.shortcodes[0],
    });
  };

  return (
    <button
      className="emoji-picker-list-emoji"
      onClick={() => handleEmojiClick(emoji.emoji)}
      onMouseOver={handleMouseOver}
      onMouseOut={() => setHoveredEmoji(null)}
    >
      {emoji.emoji}
      {/* <div
        ref={tooltipRef}
        className="tooltiptext"
        // onMouseOver={handleMouseOver}
      >
        {":" + emoji.shortcodes[0] + ":"}
      </div> */}
    </button>
  );
};

const PickerModal = forwardRef(
  ({ pickerOpen, handleEmojiClick, shortcode }, ref) => {
    const [allEmojis, setAllEmojis] = useState(emojis.flat());
    const [hoveredEmoji, setHoveredEmoji] = useState(null);
    const [tooltipLength, setTooltipLength] = useState(null);
    const tooltipRef = useRef(null);

    useEffect(() => {
      if (hoveredEmoji && tooltipRef.current) {
        const tooltipWidth = tooltipRef.current.offsetWidth;
        if (hoveredEmoji.right < tooltipWidth / 2) {
          setTooltipLength(tooltipWidth / 2);
        } else {
          setTooltipLength(tooltipRef.current.offsetWidth);
        }
      }
    }, [hoveredEmoji]);

    useEffect(() => {
      const filteredEmojis = emojis.filter((emoji) => {
        return !!emoji.shortcodes.find((sc) => sc.includes(shortcode));
      });
      console.log("filtered", filteredEmojis);
      setAllEmojis(filteredEmojis);
    }, [shortcode]);

    return (
      <>
        <div
          ref={ref}
          className="emoji-picker-list"
          style={{ display: pickerOpen ? "block" : "none" }}
        >
          <div id="picker" className="emoji-picker-list-inner">
            {allEmojis.map((emoji, index) => {
              return (
                <PickerButton
                  key={emoji.annotation}
                  emoji={emoji}
                  index={index}
                  handleEmojiClick={handleEmojiClick}
                  setHoveredEmoji={setHoveredEmoji}
                />
              );
            })}
          </div>
        </div>
        {hoveredEmoji &&
          ReactDOM.createPortal(
            <div
              ref={tooltipRef}
              id="portal"
              className="tooltiptext"
              style={{
                position: "absolute",
                top: hoveredEmoji.top - 44,
                right: hoveredEmoji.right - tooltipLength / 2 - 12,
              }}
            >
              {":" + hoveredEmoji.shortcode + ":"}
            </div>,
            document.body
          )}
      </>
    );
  }
);

PickerModal.displayName = "PickerModal";

export default PickerModal;
