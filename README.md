# Cufón Live Preview (jQuery Plugin)

This jQuery plugin can transform the text in any basic HTML `<textarea>` in to a live preview of any OTF or TTF font which you have converted to  [cufón](http://cufon.shoqolate.com/generate/) format.

What do I mean by "live preview"?  Your users can enter their text, and then view that text in a font and size they select.

## Usage

    $('textarea').cufonLivePreview({
      // fonts: An array of cufon font-family names
      //        Defaults to the entire font registry (see "Registering Fonts")
      fonts: ['ChunkFive', 'Pacifico'],

      // fontSizes: An array of numerical font sizes.
      //            Defaults to ['12', '14', '18', '24', '30', '36', '48', '60', '72']
      fontSizes: ['16', '20'],

      // defaultFontSize: The default (pre-selected) font size in the editor
      //                  Defaults to '30'.  If you provide your own values for fontSizes,
      //                  it will default to the "middle" font size unless you provide a
      //                  value for defaultFontSize
      defaultFontSize: null,
      
      // defaultFont: The default (pre-selected) font in the editor.
      //              Defaults to the first font given by fonts (or the the first in the
      //              registry)
      defaultFont: null
    });
    
### Registering Fonts

The plugin provides a callback function, `CufonLivePreview.registerFont` which can be provided as the function to receive the font data for the Cufón font generator.  This callback function will call the usual `Cufon.registerFont` after adding the font to the local font registry.  This allows us to know what fonts have been loaded, and display all fonts by default if you don't provide an explicit setting for `fonts`.  Note: As far as I can tell, Cufón does not provide a programmatic way of accessing the registered fonts - if it ever does then registration via `CufonLivePreview.registerFont` won't be necessary.

## Example

There is an example located at `public/index.html` within this repository.

Consider the following HTML:

    <script src="fonts/ChunkFive.font.js"></script>
    <script src="fonts/Pacifico.font.js"></script>

    <textarea>Hello world</textarea>
    <script>
      $('textarea').cufonLivePreview();
    </script>
    
The plugin will replace the `<textarea>` with the following HTML:

    <div class="clpwidget" id="clpwidget_1">
      <div class="clpwidget_toolbar">
        <select class="clpwidget_font_select">
          <!-- font options depend on settings-->
        </select>
        <select class="clpwidget_font_size_select">
          <!-- font size options depend on settings-->
        </select>
        <button class="clpwidget_edit_button">Edit Text</button>
        <button class="clpwidget_save_button" style="display: none; ">Save Changes</button>
      </div>
      <div class="clpwidget_preview">
        <!-- Cufon-enabled preview goes here -->
      </div>
      <textarea class="clpwidget_editor" style="display: none; ">Hello world</textarea>
    </div>
