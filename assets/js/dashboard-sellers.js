/*--------------------------------------------------------------
  Dashboard - Customers & Sellers pages
  Fills the "Pay To Seller" and "Requested message" modals with the
  data of the clicked row (payout-request.html).
--------------------------------------------------------------*/
(function ($) {
  "use strict";

  $(function () {
    // Pay to seller modal
    $(document).on("click", '[data-modal-open="#payToSellerModal"]', function () {
      var $btn = $(this);
      var $modal = $("#payToSellerModal");
      if ($btn.data("seller")) $modal.find("[data-pay-seller]").text($btn.data("seller"));
      if ($btn.data("due")) $modal.find("[data-pay-due]").text($btn.data("due"));
      if ($btn.data("requested")) {
        $modal.find("[data-pay-requested]").text($btn.data("requested"));
        $modal.find("#payAmount").val($btn.data("requested"));
      }
    });

    // Requested message modal
    $(document).on("click", '[data-modal-open="#requestMessageModal"]', function () {
      var message = $(this).data("message");
      if (message) $("#requestMessageModal [data-request-message]").text(message);
    });

    // Demo forms inside modals: close instead of submitting
    $(".cs_dash_pay_form").on("submit", function (e) {
      e.preventDefault();
      $(this).closest(".cs_dash_modal").find("[data-modal-close]").first().trigger("click");
    });
  });
})(jQuery);
