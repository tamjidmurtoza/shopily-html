/*==============================================================
  Shopily dashboard - CMS pages
  1. Select-all checkboxes
  2. Image upload preview / remove
  3. Theme activate
  4. Blog editor toolbar
  5. Tags input
================================================================*/
(function ($) {
  "use strict";

  $(function () {
    selectAll();
    imageUpload();
    themeActivate();
    editorToolbar();
    tagsInput();
  });

  /* 1. Select-all checkbox in a table head toggles every row checkbox */
  function selectAll() {
    $(document).on("change", "[data-check-all]", function () {
      const checked = this.checked;
      $(this).closest("table").find("tbody .cs_dash_cms_check").prop("checked", checked);
    });
    $(document).on("change", "tbody .cs_dash_cms_check", function () {
      const $table = $(this).closest("table");
      const total = $table.find("tbody .cs_dash_cms_check").length;
      const done = $table.find("tbody .cs_dash_cms_check:checked").length;
      $table.find("[data-check-all]").prop("checked", total > 0 && total === done);
    });
  }

  /* 2. Upload box: show the chosen image, remove button clears it */
  function imageUpload() {
    $(document).on("change", ".cs_dash_cms_upload input[type='file']", function () {
      const $box = $(this).closest(".cs_dash_cms_upload");
      const file = this.files && this.files[0];
      if (!file || !/^image\//.test(file.type)) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        let $img = $box.find(".cs_dash_cms_upload_preview");
        if (!$img.length) {
          $img = $('<img class="cs_dash_cms_upload_preview" alt="Selected image preview">').prependTo($box);
        }
        $img.attr("src", e.target.result);
        $box.addClass("cs_has_image");
      };
      reader.readAsDataURL(file);
    });

    $(document).on("click", ".cs_dash_cms_upload_remove", function () {
      const $box = $(this).closest(".cs_dash_cms_upload");
      $box.find(".cs_dash_cms_upload_preview").remove();
      $box.find("input[type='file']").val("");
      $box.removeClass("cs_has_image");
    });
  }

  /* 3. Themes: clicking "Activate" makes that theme the activated one */
  function themeActivate() {
    $(document).on("click", "[data-theme-activate]", function () {
      const $grid = $(this).closest(".cs_dash_themes");
      $grid.find("[data-theme-activate]").text("Activate").attr("aria-pressed", "false");
      $(this).text("Activated").attr("aria-pressed", "true");
    });
  }

  /* 4. Minimal rich-text toolbar for the blog content editor */
  function editorToolbar() {
    $(document).on("mousedown", ".cs_dash_cms_editor_toolbar button", function (e) {
      e.preventDefault(); // keep the selection inside the editor
    });
    $(document).on("click", ".cs_dash_cms_editor_toolbar button[data-cmd]", function () {
      const $editor = $(this).closest(".cs_dash_cms_editor").find(".cs_dash_cms_editor_body");
      $editor.trigger("focus");
      try {
        document.execCommand($(this).data("cmd"), false, null);
      } catch (err) {
        /* execCommand unsupported: ignore */
      }
    });
  }

  /* 5. Tags: "ADD" (or Enter) splits the input by commas into removable chips */
  function tagsInput() {
    function addTags($wrap) {
      const $input = $wrap.find("[data-tags-input]");
      const $list = $wrap.find("[data-tags-list]");
      String($input.val())
        .split(",")
        .map(function (t) { return t.trim(); })
        .filter(Boolean)
        .forEach(function (tag) {
          const $li = $("<li></li>").text(tag);
          $('<button type="button">&times;</button>').attr("aria-label", "Remove tag " + tag).appendTo($li);
          $list.append($li);
        });
      $input.val("");
    }

    $(document).on("click", "[data-tags-add]", function () {
      addTags($(this).closest("[data-tags]"));
    });
    $(document).on("keydown", "[data-tags-input]", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        addTags($(this).closest("[data-tags]"));
      }
    });
    $(document).on("click", "[data-tags-list] button", function () {
      $(this).closest("li").remove();
    });
  }
})(jQuery);
