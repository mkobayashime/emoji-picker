import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.wrapper}>
      <EmojiPicker
        onEmojiClick={(e) => navigator.clipboard.writeText(e.emoji)}
        theme={Theme.DARK}
        emojiStyle={EmojiStyle.TWITTER}
        width={500}
        height={600}
      />
    </div>
  );
}

export default App;
