/*=============================================================
  Shopily Dashboard - Staff, Settings & Profile pages
  ---------------------------------------------------------------
  01. Check all       ([data-check-all="name"] toggles inputs[name])
  02. Image upload    ([data-upload] preview + remove)
  03. Tabs            (.cs_dash_set_tabs / .cs_dash_set_panel)
===============================================================*/
(function ($) {
  "use strict";

  $(function () {
    checkAll();
    imageUpload();
    tabs();
  });

  /*-------------------------------------------------------------
    01. Check all
  -------------------------------------------------------------*/
  function checkAll() {
    $("[data-check-all]").each(function () {
      const $master = $(this);
      const $items = $('input[name="' + $master.data("check-all") + '"]');

      $master.on("change", function () {
        $items.prop("checked", this.checked);
      });

      $items.on("change", function () {
        const checked = $items.filter(":checked").length;
        $master.prop("checked", checked === $items.length);
        $master.prop("indeterminate", checked > 0 && checked < $items.length);
      });
    });
  }

  /*-------------------------------------------------------------
    02. Image upload preview
  -------------------------------------------------------------*/
  function imageUpload() {
    $("[data-upload]").each(function () {
      const $box = $(this);
      const $input = $box.find('input[type="file"]');
      const $img = $box.find(".cs_dash_set_upload_img");
      let objectUrl = null;

      $input.on("change", function () {
        const file = this.files && this.files[0];
        if (!file || !/^image\//.test(file.type)) return;
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        objectUrl = URL.createObjectURL(file);
        $img.attr("src", objectUrl).prop("hidden", false);
        $box.addClass("cs_has_image");
      });

      $box.find(".cs_dash_set_upload_remove").on("click", function () {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        objectUrl = null;
        $input.val("");
        $img.attr("src", "").prop("hidden", true);
        $box.removeClass("cs_has_image");
      });
    });
  }

  /*-------------------------------------------------------------
    03. Tabs
  -------------------------------------------------------------*/
  function tabs() {
    $(".cs_dash_set_tabs").each(function () {
      const $tabs = $(this).find('[role="tab"]');

      function activate($tab) {
        $tabs.each(function () {
          const on = this === $tab[0];
          $(this)
            .toggleClass("active", on)
            .attr({ "aria-selected": on, tabindex: on ? null : -1 });
          $("#" + $(this).attr("aria-controls"))
            .toggleClass("active", on)
            .prop("hidden", !on);
        });
      }

      $tabs.on("click", function () {
        activate($(this));
      });

      $tabs.on("keydown", function (e) {
        const i = $tabs.index(this);
        let next = null;
        if (e.key === "ArrowRight") next = (i + 1) % $tabs.length;
        if (e.key === "ArrowLeft") next = (i - 1 + $tabs.length) % $tabs.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = $tabs.length - 1;
        if (next === null) return;
        e.preventDefault();
        const $target = $tabs.eq(next);
        activate($target);
        $target.trigger("focus");
      });
    });
  }
})(jQuery);
