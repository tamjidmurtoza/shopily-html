/*==============================================================
  Shopily dashboard - Products pages
  - Image upload previews (cover, thumbnails, category image)
  - Remove uploaded images
  - Attribute value rows (add / remove)
================================================================*/
(function ($) {
  "use strict";

  function readImage(file, done) {
    if (!file || !/^image\//.test(file.type)) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      done(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  $(function () {
    /* ---------- Single image preview (category image, cover image) ---------- */
    $(document).on("change", "[data-upload-preview]", function () {
      const $input = $(this);
      const $box = $input.closest(".cs_dash_prd_upload");
      const $cover = $input.closest(".cs_dash_prd_cover");

      readImage(this.files[0], function (src) {
        if ($cover.length) {
          $cover.children("img").attr("src", src);
          $cover.removeClass("cs_empty");
          return;
        }
        let $preview = $box.find(".cs_dash_prd_upload_preview");
        if (!$preview.length) {
          $preview = $('<img class="cs_dash_prd_upload_preview" alt="Selected image preview">').prependTo($box);
        }
        $preview.attr("src", src);
        $box.addClass("cs_has_image");
      });
      $input.val("");
    });

    /* ---------- Thumbnail images ---------- */
    $(document).on("change", "[data-upload-thumbs]", function () {
      const $add = $(this).closest(".cs_dash_prd_upload");
      $.each(this.files, function (i, file) {
        readImage(file, function (src) {
          const $thumb = $(
            '<div class="cs_dash_prd_thumb">' +
              '<img alt="Product thumbnail">' +
              '<button type="button" class="cs_dash_prd_img_remove" data-remove-image aria-label="Remove thumbnail image">' +
              '<img src="../assets/img/dashboard/products/icon-trash-sm.svg" alt="">' +
              "</button>" +
              "</div>"
          );
          $thumb.children("img").attr("src", src);
          $thumb.insertBefore($add);
        });
      });
      $(this).val("");
    });

    /* ---------- Remove image ---------- */
    $(document).on("click", "[data-remove-image]", function () {
      const $cover = $(this).closest(".cs_dash_prd_cover");
      if ($cover.length) {
        $cover.addClass("cs_empty");
        return;
      }
      $(this).closest(".cs_dash_prd_thumb").remove();
    });

    /* ---------- Attribute values ---------- */
    let valueCount = 0;

    $(document).on("click", "[data-add-value]", function () {
      const $list = $(this).closest("form").find(".cs_dash_prd_value_list");
      const $last = $list.children(".cs_dash_prd_value_row").last();
      const $row = $last.clone();
      const id = $list.attr("id") + "_new_" + ++valueCount;
      $row.find("label").attr("for", id);
      $row.find("input").attr("id", id).val("");
      $row.appendTo($list);
      $row.find("input").trigger("focus");
    });

    $(document).on("click", "[data-remove-value]", function () {
      const $row = $(this).closest(".cs_dash_prd_value_row");
      if ($row.siblings(".cs_dash_prd_value_row").length) {
        $row.remove();
      } else {
        $row.find("input").val("").trigger("focus");
      }
    });
  });
})(jQuery);
