# wakariyasui

Userscript for utilizing [kuroshiro](https://github.com/hexenq/kuroshiro.js) features on-demand on any webpage you wish.

Features:

* Add auto-generated kanji readings to (Japanese) text entered in a textbox
* Annotate all kanji on the page with auto-generated furigana/ruby

## Usage

Install the userscript with Greasemonkey or Tampermonkey (tested with recent versions of Firefox and Chrome). 
By default the script is enabled on all webpages, it is recommended to limit this to the websites you want to use it on.

When enabled, wakariyasui registers the following hotkeys:

| Hotkey         | Meaning         | Function                                                          | Shift (without/with) |
|----------------|-----------------|-------------------------------------------------------------------|----------------------|
| Ctrl + Alt + W | **W**akariyasui | Initialize dictionaries (optional).                               |                      |
| Ctrl + Alt + A | **A**nnotate    | Add furigana to all kanji on page.                                |                      |
| Ctrl + Alt + O | **O**kurigana   | Add readings in parenthesis after kanji in text input.            | hiragana/katakana    |
| Ctrl + Alt + K | **K**ana        | Convert kanji in text input to kana.                              | hiragana/katakana    |
| Ctrl + Alt + S | **S**paced kana | Convert kanji in text input to kana and add spaces between words. | hiragana/katakana    |
| Ctrl + Alt + R | **R**ōmaji      | Convert kanji in text input to rōmaji.                            | replace/add          |

Before these functions can be used following a page load, the dictionaries have to be initialized. This can take a few moments and slow down page scripts temporarily, because it is a computation heavy operation. Dictionaries are initialized when Ctrl + Alt + W is pressed (manual trigger) or when one of the other hotkeys is used (automatic trigger).

## Examples

Ctrl + Alt + A (page furigana):

![](https://cloud.githubusercontent.com/assets/8502790/19014925/0507f66a-87fa-11e6-9745-013676c175bf.png)

Ctrl + Alt + O (input okurigana) before/after:

![](https://cloud.githubusercontent.com/assets/8502790/19015025/22b39672-87fc-11e6-8929-ac6b6e254ccd.png)
![](https://cloud.githubusercontent.com/assets/8502790/19015017/0e71a014-87fc-11e6-8d55-9d4c2dbc5e49.png)

