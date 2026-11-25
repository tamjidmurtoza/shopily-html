/*--------------------------------------------------------------
>> Dashboard: Orders + POS pages
----------------------------------------------------------------
01. Order list filters (payment / delivery status, order ID)
02. Order list delete row
03. Order details print invoice
04. POS product filter (category + search)
05. POS cart (add, quantity +/-, remove, totals, reset)
--------------------------------------------------------------*/
(function ($) {
  "use strict";

  $(function () {
    /*--------------------------------------------------------------
      01. Order list filters
    --------------------------------------------------------------*/
    const $orderTable = $(".cs_dash_order_table");

    function filterOrders() {
      const $form = $(".cs_dash_order_filters");
      const delivery = $form.find("[name='delivery']").val();
      const payment = $form.find("[name='payment']").val();
      const query = $.trim($form.find("[name='order_id']").val()).toLowerCase().replace("#", "");
      let visible = 0;

      $orderTable.find("tbody tr").each(function () {
        const $row = $(this);
        const id = $row.children().first().text().toLowerCase().replace("#", "");
        const match =
          (!delivery || $row.data("delivery") === delivery) &&
          (!payment || $row.data("payment") === payment) &&
          (!query || id.indexOf(query) !== -1);
        $row.toggleClass("cs_hidden", !match);
        if (match) visible++;
      });
      $orderTable.siblings(".cs_dash_table_empty").prop("hidden", visible > 0);
    }

    if ($orderTable.length) {
      $(".cs_dash_order_filters").on("submit", function (e) {
        e.preventDefault();
        filterOrders();
      });
      $(".cs_dash_order_filters select").on("change", filterOrders);
    }

    /*--------------------------------------------------------------
      02. Order list delete row
    --------------------------------------------------------------*/
    $(document).on("click", ".cs_dash_order_delete", function () {
      $(this).closest("tr").fadeOut(200, function () {
        $(this).remove();
      });
    });

    /*--------------------------------------------------------------
      03. Order details print invoice
    --------------------------------------------------------------*/
    $(".cs_dash_print_invoice").on("click", function () {
      window.print();
    });

    /*--------------------------------------------------------------
      04. POS product filter
    --------------------------------------------------------------*/
    const $posGrid = $(".cs_dash_pos_grid");

    function filterProducts() {
      const category = $("#posCategory").val();
      const query = $.trim($("#posSearch").val()).toLowerCase();
      let visible = 0;

      $posGrid.children("li").each(function () {
        const $item = $(this);
        const name = String($item.find(".cs_dash_pos_product").data("name")).toLowerCase();
        const match = (!category || $item.data("category") === category) && (!query || name.indexOf(query) !== -1);
        $item.toggleClass("cs_hidden", !match);
        if (match) visible++;
      });
      $(".cs_dash_pos_empty").prop("hidden", visible > 0);
    }

    if ($posGrid.length) {
      $("#posCategory").on("change", filterProducts);
      $("#posSearch").on("input", filterProducts);
      $(".cs_dash_pos_toolbar").on("submit", function (e) {
        e.preventDefault();
        filterProducts();
      });
    }

    /*--------------------------------------------------------------
      05. POS cart
    --------------------------------------------------------------*/
    const $cart = $(".cs_dash_pos_cart tbody");
    if (!$cart.length) return;

    const money = function (n) {
      return "$" + Math.abs(n).toFixed(2);
    };
    const num = function (val) {
      const n = parseFloat(String(val).replace(/[^0-9.]/g, ""));
      return isNaN(n) ? 0 : n;
    };
    // "10%" -> 10% of base, "5" -> 5
    const amountOrPercent = function (val, base) {
      const str = $.trim(String(val));
      if (!str) return 0;
      return str.indexOf("%") !== -1 ? (base * num(str)) / 100 : num(str);
    };
    const escapeHtml = function (str) {
      return $("<div>").text(str).html();
    };

    function renumber() {
      const $rows = $cart.children("tr[data-id]");
      $rows.each(function (i) {
        $(this).children(".cs_no").text(String(i + 1).padStart(2, "0"));
      });
      $cart.children(".cs_dash_pos_cart_empty").remove();
      if (!$rows.length) {
        $cart.append('<tr class="cs_dash_pos_cart_empty"><td colspan="5">No items in cart. Click a product to add it.</td></tr>');
      }
    }

    function updateTotals() {
      let subtotal = 0;
      $cart.children("tr[data-id]").each(function () {
        subtotal += num($(this).data("price")) * num($(this).find("output").text());
      });
      const discount = Math.min(amountOrPercent($("#posDiscount").val(), subtotal), subtotal);
      const vat = amountOrPercent($("#posVat").val(), subtotal - discount);
      const total = subtotal - discount + vat;
      const paid = num($("#posPaid").val());
      const due = total - paid;

      $("[data-pos='subtotal']").text(money(subtotal));
      $("[data-pos='discount']").text("-" + money(discount));
      $("[data-pos='vat']").text("+" + money(vat));
      $("[data-pos='total']").text(money(total));
      $("[data-pos='due']").text(due >= 0 ? "Due " + money(due) : "Change " + money(due));
    }

    function addToCart($product) {
      const id = String($product.data("id"));
      const $existing = $cart.children("tr[data-id='" + id + "']");
      if ($existing.length) {
        const $out = $existing.find("output");
        $out.text(num($out.text()) + 1);
      } else {
        const name = escapeHtml($product.data("name"));
        const price = num($product.data("price"));
        $cart.append(
          '<tr data-id="' + id + '" data-price="' + price + '">' +
            '<td class="cs_no"></td>' +
            '<td class="cs_item"><span class="cs_dash_pos_item_name" title="' + name + '">' + name + "</span></td>" +
            '<td class="cs_qty"><div class="cs_dash_qty">' +
            '<button type="button" class="cs_minus" aria-label="Decrease quantity"></button>' +
            '<output aria-live="polite">1</output>' +
            '<button type="button" class="cs_plus" aria-label="Increase quantity"></button>' +
            "</div></td>" +
            '<td class="cs_price">' + money(price) + "</td>" +
            '<td class="cs_action"><div class="cs_dash_table_actions"><button type="button" class="cs_dash_pos_remove" aria-label="Remove item">' +
            '<img src="../assets/img/dashboard/icon-delete.svg" alt=""></button></div></td>' +
            "</tr>"
        );
      }
      renumber();
      updateTotals();
    }

    $(".cs_dash_pos_product").on("click", function () {
      addToCart($(this));
    });

    $cart.on("click", ".cs_plus, .cs_minus", function () {
      const $out = $(this).siblings("output");
      const qty = num($out.text()) + ($(this).hasClass("cs_plus") ? 1 : -1);
      $out.text(Math.max(1, qty));
      updateTotals();
    });

    $cart.on("click", ".cs_dash_pos_remove", function () {
      $(this).closest("tr").remove();
      renumber();
      updateTotals();
    });

    $("#posDiscount, #posVat, #posPaid").on("input", updateTotals);

    $("[data-pos-reset]").on("click", function () {
      $cart.empty();
      $("#posDiscount, #posVat, #posPaid").val("");
      $("#posCustomer").prop("selectedIndex", 0);
      $("input[name='pos_payment']").first().prop("checked", true);
      renumber();
      updateTotals();
    });

    updateTotals();
  });
})(jQuery);
