import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { debounce } from "debounce";
import { init, SearchIndex } from "emoji-mart";
import emojiData from "@emoji-mart/data";
import styles from "./App.module.scss";
import { ChangeEvent, memo, useEffect, useState } from "react";

init({ data: emojiData });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      ["em-emoji"]: unknown;
    }
  }
}

const RichPicker = memo(() => (
  <EmojiPicker
    onEmojiClick={(e) => navigator.clipboard.writeText(e.emoji)}
    theme={Theme.DARK}
    emojiStyle={EmojiStyle.TWITTER}
    width={"100%"}
    height={600}
    autoFocusSearch={false}
  />
));

function App() {
  const [isSimpleSearchActive, setIsSimpleSearchActive] = useState(false);
  const [choices, setChoices] = useState<Array<{ id: string; glyph: string }>>(
    []
  );
  const [activeChoiceIndex, setActiveChoiceIndex] = useState(0);

  const onSimpleSearchInput = async (event: ChangeEvent<HTMLInputElement>) => {
    setActiveChoiceIndex(0);

    const query = event.target.value;
    const emojis: Array<{ id: string; skins: Array<{ native: string }> }> =
      await SearchIndex.search(query);
    if (!emojis) setChoices([]);

    setChoices(
      emojis
        .slice(0, 15)
        .map(({ id, skins }) => ({ id, glyph: skins[0].native }))
    );
  };

  const completeSimpleSearch = (emoji?: string) => {
    if (emoji) navigator.clipboard.writeText(emoji);

    setIsSimpleSearchActive(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") completeSimpleSearch();
    };

    document.addEventListener("keydown", onKeydown);

    () => {
      document.removeEventListener("keydown", onKeydown);
    };
  });

  const onSimpleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === "ArrowDown") {
      setActiveChoiceIndex((cur) => (choices.length > cur + 1 ? cur + 1 : 0));
    } else if (event.key === "ArrowUp") {
      setActiveChoiceIndex((cur) => (cur === 0 ? choices.length - 1 : cur - 1));
    } else if (event.key === "Enter") {
      completeSimpleSearch(choices[activeChoiceIndex].glyph);
    }
  };

  const onChoiceKeydown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (event.key === "Enter") {
      event.stopPropagation();
      setActiveChoiceIndex(index);
      completeSimpleSearch(choices[index].glyph);
    }
  };

  const onChoiceClick = (index: number) => {
    setActiveChoiceIndex(index);
    completeSimpleSearch(choices[index].glyph);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.contents}>
        <div
          className={styles.simpleSearchWrapper}
          onKeyDown={(e) => onSimpleSearchKeyDown(e)}
        >
          <input
            className={styles.simpleSearchInput}
            placeholder="Simple search"
            onChange={debounce(onSimpleSearchInput, 200)}
            tabIndex={0}
            onFocus={() => setIsSimpleSearchActive(true)}
          />
          {isSimpleSearchActive && (
            <div className={styles.choicesWrapper}>
              {choices.map(({ id: emojiId }, index) => (
                <button
                  className={styles.choiceWrapper}
                  data-selected={index === activeChoiceIndex}
                  onKeyDown={(e) => onChoiceKeydown(e, index)}
                  onClick={() => onChoiceClick(index)}
                >
                  <div className={styles.choiceEmoji}>
                    <em-emoji
                      id={emojiId}
                      size="1.5em"
                      // set="twitter"
                    ></em-emoji>
                  </div>
                  <div className={styles.choiceName}>{emojiId}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div
          className={styles.richPickerWrapper}
          data-active={!isSimpleSearchActive}
        >
          <RichPicker />
        </div>
      </div>
    </div>
  );
}

export default App;
