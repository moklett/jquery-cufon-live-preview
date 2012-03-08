describe("cufonLivePreview plugin", function() {
  it("does nothing when invoked on an element that is not a textarea", function() {
    loadFixtures('div.html');
    $('#target').cufonLivePreview();
    
    expect($('div.clpwidget')).not.toExist();
  });
  
  describe("invoked on a single textarea", function(){
    beforeEach(function() {
      loadFixtures('single.html');
      $('textarea#target').cufonLivePreview();
    });
    
    it("inserts a div.clpwidget on to the page", function() {
      expect($('div.clpwidget')).toExist();
    });
    
    it("adds a toolbar to the widget", function() {
      var widget = $('div.clpwidget');
      expect(widget).toContain('div.clpwidget_toolbar');
      expect(widget).toContain('div.clpwidget_toolbar > select.clpwidget_font_select');
      expect(widget).toContain('div.clpwidget_toolbar > select.clpwidget_font_size_select');
      expect(widget).toContain('div.clpwidget_toolbar > button.clpwidget_edit_button');
      expect(widget).toContain('div.clpwidget_toolbar > button.clpwidget_save_button');
      expect($('button.clpwidget_save_button')).toBeHidden();
    });
    
    it("keeps the edit button visible", function() {
      expect($('button.clpwidget_edit_button')).not.toBeHidden();
    });
    
    it("adds a preview pane to the widget", function() {
      var widget = $('div.clpwidget');
      expect(widget).toContain('div.clpwidget_preview');
    });
    
    it("places the initial content inside the preview pane", function(){
      expect($('div.clpwidget_preview')).toHaveText("I am the initial content");
    });
    
    it("adds the clpwidget_editor class to the textarea", function() {
      expect($('textarea#target')).toHaveClass("clpwidget_editor");
    });
    
    it("moves the textarea/editor within the widget", function() {
      expect($('div.clpwidget')).toContain($('textarea#target'));
    });
    
    it("hides the editor", function() {
      expect($('textarea#target')).toBeHidden();
    });
    
    it("calls Cufon.replace on the preview pane with the default font and size", function() {
      loadFixtures('single.html');
      spyOn(Cufon, 'replace');
      $('textarea#target').cufonLivePreview();
      
      var expectedSelector = "#clpwidget_"+CufonLivePreview.Widget.widgets.length+" .clpwidget_preview";

      expect(Cufon.replace).toHaveBeenCalledWith(expectedSelector, {fontFamily: 'ChunkFive', fontSize: '30px'});
    });
    
    it("defaults to providing all fonts in the font registry (all loaded fonts)", function(){
      // Map the values to a jQuery array and then `get` the basic array
      var options = $('.clpwidget_font_select option').map(function() {
        return $(this).val();
      });
      expect(options.toArray()).toEqual(['ChunkFive', 'Pacifico']);
    });
    
    it("defaults to providing font sizes '12', '14', '18', '24', '30', '36', '48', '60', and '72'", function() {
      // Map the values to a jQuery array and then `get` the basic array
      var options = $('.clpwidget_font_size_select option').map(function() {
        return $(this).val();
      });
      expect(options.toArray()).toEqual(['12', '14', '18', '24', '30', '36', '48', '60', '72']);
    });
    
    it("selects an initial 30px font size", function() {
      expect($('.clpwidget_font_size_select').val()).toEqual('30');
    });
    
    it("displays the editor when clicking on the 'Change text' button", function() {
      expect($('.clpwidget_editor')).toBeHidden();
      $('.clpwidget_edit_button').click();
      expect($('.clpwidget_editor')).not.toBeHidden();
    });

    it("displays the editor when clicking on the preview", function() {
      expect($('.clpwidget_editor')).toBeHidden();
      $('.clpwidget_preview').click();
      expect($('.clpwidget_editor')).not.toBeHidden();
    });
  });

  describe("invoked on two texareas", function() {
    beforeEach(function() {
      loadFixtures('double.html');
      $('textarea').cufonLivePreview();
    });
    
    it("inserts two div.clpwidgets on to the page", function() {
      expect($('div.clpwidget').length).toBe(2);
    });
  });
  
  describe("invoked with settings", function() {
    beforeEach(function() {
      loadFixtures('single.html');
    });
    
    it("makes only those fonts specified using settings.fonts available for selection", function() {
      $('textarea#target').cufonLivePreview({
        fonts: ['Pacifico']
      });

      // Map the values to a jQuery array and then `get` the basic array
      var options = $('.clpwidget_font_select option').map(function() {
        return $(this).val();
      });
      expect(options.toArray()).toEqual(['Pacifico']);
    });
    
    it("displays font names in the select box different from the font-family name, when an array of arrays is given to settings.fonts", function() {
      $('textarea#target').cufonLivePreview({
        fonts: [['Pacifico - pick me!', 'Pacifico']]
      });

      var names = [];
      var values = [];
      
      $('.clpwidget_font_select option').each(function() {
        names.push($(this).text());
        values.push($(this).val());
      });

      expect(names).toEqual(['Pacifico - pick me!']);
      expect(values).toEqual(['Pacifico']);
    });
    
    it("selects the first font specified, by default", function() {
      $('textarea#target').cufonLivePreview({
        fonts: ['ChunkFive', 'Pacifico']
      });

      // Map the values to a jQuery array and then `get` the basic array
      expect($('.clpwidget_font_select option:selected').val()).toEqual("ChunkFive");
    });

    it("selects the font specified by settings.defaultFont, if given", function() {
      $('textarea#target').cufonLivePreview({
        fonts: ['ChunkFive', 'Pacifico'],
        defaultFont: 'Pacifico'
      });

      // Map the values to a jQuery array and then `get` the basic array
      expect($('.clpwidget_font_select option:selected').val()).toEqual("Pacifico");
    });
    
    it("makes only those font sizes specified using settings.fontSizes available for selection", function() {
      $('textarea#target').cufonLivePreview({
        fontSizes: ['1', '2', '3']
      });

      // Map the values to a jQuery array and then `get` the basic array
      var options = $('.clpwidget_font_size_select option').map(function() {
        return $(this).val();
      });
      expect(options.toArray()).toEqual(['1', '2', '3']);
    });
    
    it("selects the 'middle' font size by default with an odd number of font sizes (i.e '2' in ['1','2','3'])", function() {
      $('textarea#target').cufonLivePreview({
        fontSizes: ['1', '2', '3']
      });

      expect($('.clpwidget_font_size_select option:selected').val()).toEqual('2');
    });

    it("selects the end-weighted 'middle' font size by default with an even number of font sizes (i.e '3' in ['1','2','3','4'])", function() {
      $('textarea#target').cufonLivePreview({
        fontSizes: ['1', '2', '3', '4']
      });

      expect($('.clpwidget_font_size_select option:selected').val()).toEqual('3');
    });
    
    it("selects the font sizes specified using settings.defaultFontSize, if given", function() {
      $('textarea#target').cufonLivePreview({
        fontSizes: ['1', '2', '3'],
        defaultFontSize: 3
      });

      expect($('.clpwidget_font_size_select option:selected').val()).toEqual('3');
    });
    
    it("shows the edit button when hideEditButton=false", function() {
      $('textarea#target').cufonLivePreview({
        hideEditButton: false
      });
      expect($('button.clpwidget_edit_button')).not.toBeHidden();
    });

    it("hides the edit button when hideEditButton=true", function() {
      $('textarea#target').cufonLivePreview({
        hideEditButton: true
      });
      expect($('button.clpwidget_edit_button')).toBeHidden();
    });
  });
});
