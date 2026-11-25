/*--------------------------------------------------------------
  Shopily dashboard - support, messages, reviews, refunds
----------------------------------------------------------------
  01. Table filter (status select) + search
  02. Message option dropdown (ticket reply)
  03. Reply editor toolbar
  04. Chat: contact switching, search, send message
  05. Reviews: delete row
  06. Refund approval popup
--------------------------------------------------------------*/
(function ($) {
  "use strict";

  $(function () {
    tableFilter();
    moreMenu();
    editor();
    chat();
    reviews();
    refund();
  });

  /* 01. Table filter + search */
  function tableFilter() {
    function apply($table) {
      const status = ($('[data-table-filter="#' + $table.attr("id") + '"]').val() || "").toLowerCase();
      const term = ($('[data-table-search="#' + $table.attr("id") + '"]').val() || "").toLowerCase().trim();
      $table.find("tbody tr").each(function () {
        const $row = $(this);
        const okStatus = !status || String($row.data("status")) === status;
        const okTerm = !term || $row.text().toLowerCase().indexOf(term) > -1;
        $row.toggle(okStatus && okTerm);
      });
    }
    $("[data-table-filter]").on("change", function () {
      apply($($(this).data("table-filter")));
    });
    $("[data-table-search]").on("input", function () {
      apply($($(this).data("table-search")));
    });
  }

  /* 02. Message option dropdown */
  function moreMenu() {
    $(document).on("click", ".cs_dash_more > button", function (e) {
      e.stopPropagation();
      const $more = $(this).parent();
      $(".cs_dash_more").not($more).removeClass("active").children("button").attr("aria-expanded", "false");
      $more.toggleClass("active");
      $(this).attr("aria-expanded", $more.hasClass("active"));
    });
    $(document).on("click", function () {
      $(".cs_dash_more").removeClass("active").children("button").attr("aria-expanded", "false");
    });
  }

  /* 03. Reply editor */
  function editor() {
    $(".cs_dash_editor_toolbar [data-cmd]").on("mousedown", function (e) {
      e.preventDefault();
      document.execCommand($(this).data("cmd"), false, null);
    });
    $(".cs_dash_reply_form").on("submit", function (e) {
      e.preventDefault();
      $(this).find(".cs_dash_editor_area").empty().trigger("focus");
    });
  }

  /* 04. Chat */
  function chat() {
    const $contacts = $(".cs_dash_chat_contact");
    if (!$contacts.length) return;

    $contacts.on("click", function () {
      const $c = $(this);
      const online = String($c.data("online")) === "true";
      $contacts.removeClass("active");
      $c.addClass("active").find(".cs_dash_chat_unread").remove();
      $(".cs_dash_chat_header_name").text($c.data("name"));
      $(".cs_dash_chat_header_img").attr("src", $c.data("img"));
      $(".cs_dash_chat_header_status").text(online ? "Online" : "Offline");
      $(".cs_dash_chat_header .cs_dash_chat_status")
        .attr("src", $c.find(".cs_dash_chat_status").attr("src"))
        .attr("alt", online ? "Online" : "Offline");
      $(".cs_dash_chat_msg:not(.cs_me) .cs_dash_chat_msg_avatar img").attr("src", $c.data("img"));
    });

    $("#chatSearch").on("input", function () {
      const term = $(this).val().toLowerCase().trim();
      $contacts.each(function () {
        $(this).closest("li").toggle(!term || String($(this).data("name")).toLowerCase().indexOf(term) > -1);
      });
    });

    $(".cs_dash_chat_form").on("submit", function (e) {
      e.preventDefault();
      const $input = $(this).find("input");
      const text = $.trim($input.val());
      if (!text) return;
      const $box = $(".cs_dash_chat_messages");
      const avatar = $box.find(".cs_me .cs_dash_chat_msg_avatar").first().clone();
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const $msg = $('<div class="cs_dash_chat_msg cs_me"><div class="cs_dash_chat_bubble"><p></p><time></time></div></div>');
      $msg.find("p").text(text);
      $msg.find("time").text(time);
      $msg.prepend(avatar);
      $box.append($msg).scrollTop($box[0].scrollHeight);
      $input.val("").trigger("focus");
    });
  }

  /* 05. Reviews */
  function reviews() {
    $(document).on("click", "[data-row-delete]", function () {
      $(this).closest("tr").fadeOut(200, function () {
        $(this).remove();
      });
    });
    $("[data-approval]").on("change", function () {
      $(this).closest("tr").attr("data-status", this.checked ? "approved" : "non approved").data("status", this.checked ? "approved" : "non approved");
    });
  }

  /* 06. Refund approval popup */
  function refund() {
    let $row = null;
    const badge = { Approved: "cs_green", Pending: "cs_blue", Rejected: "cs_red" };
    $(document).on("click", "[data-refund-status]", function () {
      $row = $(this).closest("tr");
      $("#refundModal .cs_dash_refund_status").text($(this).data("refund-status"));
    });
    $("[data-refund-action]").on("click", function () {
      const status = $(this).data("refund-action");
      $("#refundModal .cs_dash_refund_status").text(status);
      if ($row) {
        $row.attr("data-status", status.toLowerCase()).data("status", status.toLowerCase());
        $row.find(".cs_dash_badge").removeClass("cs_green cs_blue cs_red").addClass(badge[status]).text(status);
        $row.find("[data-refund-status]").data("refund-status", status).attr("data-refund-status", status);
      }
      $(this).closest(".cs_dash_modal").find("[data-modal-close]").first().trigger("click");
    });
  }
})(jQuery);
