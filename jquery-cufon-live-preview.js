var CufonLivePreview = function($) {
  // =================================================================
  // Widget
  // =================================================================
  var Widget = function(textarea, settings) {
    this.textarea = textarea;
    this.settings = $.extend({
      fonts: CufonLivePreview.fontRegistry,
      fontSizes: ['12', '14', '18', '24', '30', '36', '48', '60', '72'],
      defaultFontSize: null,
      defaultFont: null,
      hideEditButton: false
    }, settings);
    Widget.addWidget(this);
    this.generateHTML();
  }

  Widget.widgets = [];

  Widget.defaultContent = "Enter your text here";

  Widget.addWidget = function(widget) {
    Widget.widgets.push(widget);
    widget.widgetId = "clpwidget_"+Widget.widgets.length.toString();
  }
  
  Widget.prototype.content = function() {
    var val = $.trim(this.textarea.val());
    val = val.replace(/\n/g, "<br>");
    if (val.length === 0) {
      val = Widget.defaultContent;
      this.textarea.val(val)
    }
    return val;
  }

  Widget.prototype.generateHTML = function() {
    this.root = $('<div class="clpwidget" id="'+this.widgetId+'"/>');
    this.toolbar = $('<div class="clpwidget_toolbar"/>');
    this.toolbarFontSelector = $('<select class="clpwidget_font_select"/>');
    this.toolbarSizeSelector = $('<select class="clpwidget_font_size_select"/>');
    this.toolbarEditButton = $('<button class="clpwidget_edit_button">Change Text</button>');
    this.toolbarUpdateButton = $('<button class="clpwidget_save_button">Update</button>').hide();
    this.previewPane = $('<div class="clpwidget_preview"/>').html(this.content());
    this.textarea.addClass('clpwidget_editor');
    
    this.root.append(
      this.toolbar.append(
        this.toolbarFontSelector.append(this.htmlFontSelectOptions()),
        this.toolbarSizeSelector.append(this.htmlFontSizeSelectOptions()),
        this.toolbarEditButton,
        this.toolbarUpdateButton
      ),
      this.previewPane
    )
  }
  
  Widget.prototype.htmlFontSelectOptions = function() {
    var htmls = [];

    if (this.settings.fonts.length == 0) {
      htmls.push('<option value="">No Fonts Loaded</option>');
    } else {
      $.each(this.settings.fonts, function(index,font) {
        var key = font;
        var value = font;
        
        if ($.isArray(font)) {
          key = font[0];
          value = font[1];
        }
        
        htmls.push('<option value="'+value+'">'+key+'</option>');
      });
    }
    return $(htmls.join(''));
  }
  
  Widget.prototype.htmlFontSizeSelectOptions = function() {
    var htmls = [];
    $.each(this.settings.fontSizes, function(index,size) {
      htmls.push('<option value="'+size+'">'+size+'</option>');
    });
    return $(htmls.join(''));
  }
  
  Widget.prototype.init = function() {
    this.textarea.before(this.root);
    this.root.append(this.textarea);
    this.textarea.hide();
    if (this.settings.hideEditButton === true) {
      this.toolbarEditButton.hide();
    }
    this.toolbarFontSelector.val(this.computeDefaultFont());
    this.toolbarSizeSelector.val(this.computeDefaultFontSize());
    this.preview();
    var widget = this;
    this.toolbarSizeSelector.change(function() {
      widget.preview();
    });
    this.toolbarFontSelector.change(function() {
      widget.preview();
    });
    this.previewPane.click(function() {
      widget.edit();
    });
    this.toolbarEditButton.click(function() {
      widget.edit();
    });
    this.toolbarUpdateButton.click(function() {
      widget.update();
    });
  }

  Widget.prototype.computeDefaultFontSize = function() {
    if (this.settings.defaultFontSize == null) {
      var index = Math.floor(this.settings.fontSizes.length / 2);
      return this.settings.fontSizes[index];
    } else {
      return this.settings.defaultFontSize.toString();
    }
  }

  Widget.prototype.computeDefaultFont = function() {
    if (this.settings.defaultFont == null) {
      return this.settings.fonts[0]
    } else {
      return this.settings.defaultFont;
    }
  }
  
  Widget.prototype.preview = function() {
    var selectedFont = this.toolbarFontSelector.val();
    var selectedFontSize = this.toolbarSizeSelector.val();
    Cufon.replace(this.previewPaneSelector(), {'fontFamily': selectedFont, 'fontSize': selectedFontSize+"px"});
  }
  
  Widget.prototype.edit = function() {
    this.previewPane.hide();
    this.textarea.show();
    this.textarea.height(Math.max(50, this.previewPane.height()));
    this.toolbarEditButton.hide();
    this.toolbarUpdateButton.show();
  }

  Widget.prototype.update = function() {
    this.previewPane.show();
    this.textarea.hide();
    if (this.settings.hideEditButton != true) {
      this.toolbarEditButton.show();
    }
    this.toolbarUpdateButton.hide();
    this.previewPane.html(this.content());
    this.preview();
  }
  
  Widget.prototype.previewPaneSelector = function() {
    return "#"+this.root.attr('id')+" .clpwidget_preview"
  }

// Public

  return {
    Widget: Widget,
    
    fontRegistry: [],
    
    registerFont: function(font) {
      CufonLivePreview.fontRegistry.push(font.face["font-family"]);
      Cufon.registerFont(font);
      return font;
    }
  }
}( jQuery );

(function( $ ) {
  $.fn.cufonLivePreview = function(settings) {
    return this.each(function(index,element) {
      if (element.nodeName == 'TEXTAREA') {
        new CufonLivePreview.Widget($(element), settings).init();
      }
    });
  };
})( jQuery );
