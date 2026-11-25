/*=============================================================
  Shopily Dashboard (Admin & Seller) scripts
  ---------------------------------------------------------------
  01. Theme mode (shares the "shopily-theme" key with the storefront)
  02. Sidebar toggle & submenus
  03. Profile dropdown
  04. Modals  ([data-modal-open="#id"], [data-modal-close])
  05. Pill tabs
  06. Charts (Chart.js) - only runs when the canvas exists
===============================================================*/
(function ($) {
  "use strict";

  $(function () {
    themeMode();
    sidebar();
    profileDropdown();
    modals();
    pillTabs();
    charts();
  });

  /*-------------------------------------------------------------
    01. Theme mode
  -------------------------------------------------------------*/
  function themeMode() {
    const storageKey = "shopily-theme";
    try {
      if (localStorage.getItem(storageKey) === "dark") {
        $("body").addClass("cs_dark");
      }
    } catch (e) {}

    $(".cs_dash_mode_toggle").on("click", function () {
      const isDark = $("body").toggleClass("cs_dark").hasClass("cs_dark");
      try {
        localStorage.setItem(storageKey, isDark ? "dark" : "light");
      } catch (e) {}
      $(document).trigger("cs:themechange");
    });
  }

  /*-------------------------------------------------------------
    02. Sidebar
  -------------------------------------------------------------*/
  function sidebar() {
    const $body = $("body");

    // Highlight the current page. Detail pages can point at their parent
    // list page with <body data-dash-active="orders.html">.
    const current = $body.data("dash-active") || window.location.pathname.split("/").pop() || "index.html";
    const $link = $(".cs_dash_nav a").filter(function () {
      return ($(this).attr("href") || "").split("/").pop() === current;
    }).first();
    if ($link.length) {
      $link.addClass("active").attr("aria-current", "page");
      const $parent = $link.closest(".cs_dash_has_sub");
      if ($parent.length) {
        $parent.addClass("open").children(".cs_dash_nav_link").attr("aria-expanded", "true");
      }
    }

    $(".cs_dash_sidebar_toggle").on("click", function () {
      if (window.matchMedia("(min-width: 1400px)").matches) {
        $body.toggleClass("cs_sidebar_collapsed");
      } else {
        $body.toggleClass("cs_sidebar_open");
      }
    });

    $(".cs_dash_overlay").on("click", function () {
      $body.removeClass("cs_sidebar_open");
    });

    $(".cs_dash_has_sub > .cs_dash_nav_link").on("click", function (e) {
      e.preventDefault();
      const $item = $(this).parent();
      $item.toggleClass("open");
      $(this).attr("aria-expanded", $item.hasClass("open"));
    });
  }

  /*-------------------------------------------------------------
    03. Profile dropdown
  -------------------------------------------------------------*/
  function profileDropdown() {
    $(".cs_dash_profile_btn").on("click", function (e) {
      e.stopPropagation();
      const $wrap = $(this).closest(".cs_dash_profile").toggleClass("open");
      $(this).attr("aria-expanded", $wrap.hasClass("open"));
    });

    $(document).on("click", function (e) {
      if (!$(e.target).closest(".cs_dash_profile").length) {
        $(".cs_dash_profile").removeClass("open");
        $(".cs_dash_profile_btn").attr("aria-expanded", "false");
      }
    });
  }

  /*-------------------------------------------------------------
    04. Modals
  -------------------------------------------------------------*/
  function modals() {
    function closeModal($modal) {
      $modal.removeClass("active");
      if (!$(".cs_dash_modal.active").length) {
        $("body").removeClass("cs_dash_modal_open");
      }
    }

    $(document).on("click", "[data-modal-open]", function (e) {
      e.preventDefault();
      const $modal = $($(this).data("modal-open"));
      if ($modal.length) {
        $modal.addClass("active");
        $("body").addClass("cs_dash_modal_open");
      }
    });

    $(document).on("click", "[data-modal-close]", function (e) {
      e.preventDefault();
      closeModal($(this).closest(".cs_dash_modal"));
    });

    $(document).on("click", ".cs_dash_modal", function (e) {
      if (e.target === this) closeModal($(this));
    });

    $(document).on("keydown", function (e) {
      if (e.key === "Escape") closeModal($(".cs_dash_modal.active"));
    });
  }

  /*-------------------------------------------------------------
    05. Pill tabs
  -------------------------------------------------------------*/
  function pillTabs() {
    $(".cs_dash_pill_tabs button").on("click", function () {
      $(this).addClass("active").attr("aria-pressed", "true");
      $(this).siblings().removeClass("active").attr("aria-pressed", "false");
    });
  }

  /*-------------------------------------------------------------
    06. Charts
  -------------------------------------------------------------*/
  function charts() {
    if (typeof Chart === "undefined") return;

    const blue = "#3f85fe";
    const green = "#30a346";
    const teal = "#38cb89";
    const red = "#ef4b4b";
    const days = ["1 Jan", "2 Jan", "3 Jan", "4 Jan", "5 Jan", "6 Jan", "7 Jan", "8 Jan", "9 Jan", "10 Jan", "11 Jan", "12 Jan"];
    const instances = [];

    function palette() {
      const dark = $("body").hasClass("cs_dark");
      return {
        text: dark ? "#9d9d9d" : "#6e6e6e",
        grid: dark ? "#2a2a2a" : "#e8e8e8",
        card: dark ? "#191919" : "#fff",
        heading: dark ? "#fff" : "#191919",
      };
    }

    function tooltip(label, prefix) {
      const c = palette();
      return {
        backgroundColor: c.card,
        titleColor: c.heading,
        bodyColor: c.text,
        borderColor: c.grid,
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        rtl: rtl,
        titleAlign: "center",
        bodyAlign: "center",
        titleFont: { family: "Rubik", size: 25, weight: "500" },
        bodyFont: { family: "Rubik", size: 12 },
        callbacks: {
          title: (items) => (prefix || "") + items[0].formattedValue,
          label: () => label,
        },
      };
    }

    // In RTL the timeline runs right-to-left and the value axis sits on the right
    const rtl = document.documentElement.getAttribute("dir") === "rtl";

    function axes(prefix) {
      const c = palette();
      return {
        x: {
          reverse: rtl,
          grid: { display: false },
          border: { display: false },
          ticks: { color: c.text, font: { family: "Rubik", size: 14 } },
        },
        y: {
          position: rtl ? "right" : "left",
          beginAtZero: true,
          grid: { color: c.grid, drawTicks: false },
          border: { display: false },
          ticks: {
            color: c.text,
            padding: 15,
            font: { family: "Rubik", size: 14 },
            callback: (v) => (prefix || "") + v,
          },
        },
      };
    }

    // Revenue status (bar)
    const revenue = document.getElementById("revenueChart");
    if (revenue) {
      instances.push(
        new Chart(revenue, {
          type: "bar",
          data: {
            labels: days,
            datasets: [
              {
                data: [196, 158, 170, 238, 111, 250, 140, 187, 151, 187, 226, 187],
                backgroundColor: blue,
                borderRadius: { topLeft: 20, topRight: 20 },
                borderSkipped: false,
                maxBarThickness: 20,
                barPercentage: 0.55,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: tooltip("Revenue", "$") },
            scales: Object.assign(axes("$"), {}),
          },
        })
      );
      instances[instances.length - 1].options.scales.y.max = 250;
      instances[instances.length - 1].options.scales.y.ticks.stepSize = 50;
      instances[instances.length - 1].update();
    }

    // Selling / joining status (line)
    const selling = document.getElementById("sellingChart");
    if (selling) {
      const ctx = selling.getContext("2d");
      const fill = ctx.createLinearGradient(0, 0, 0, 300);
      fill.addColorStop(0, "rgba(63,133,254,0.12)");
      fill.addColorStop(1, "rgba(63,133,254,0)");
      const label = selling.dataset.label || "Sells";
      instances.push(
        new Chart(selling, {
          type: "line",
          data: {
            labels: days,
            datasets: [
              {
                data: [0, 8, 9, 5, 12, 6, 9, 4, 13, 10, 24, 19],
                borderColor: blue,
                borderWidth: 3,
                backgroundColor: fill,
                fill: true,
                tension: 0.45,
                pointRadius: (c) => (c.dataIndex === c.dataset.data.length - 1 ? 6 : 0),
                pointHoverRadius: 6,
                pointBackgroundColor: blue,
                pointBorderWidth: 0,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            interaction: { mode: "index", intersect: false },
            plugins: { legend: { display: false }, tooltip: tooltip(label) },
            scales: axes(),
          },
        })
      );
      const chart = instances[instances.length - 1];
      chart.options.scales.y.max = 25;
      chart.options.scales.y.ticks.stepSize = 5;
      chart.update();
    }

    // Activity overview (doughnut)
    const activity = document.getElementById("activityChart");
    if (activity) {
      instances.push(
        new Chart(activity, {
          type: "doughnut",
          data: {
            labels: ["Ordered", "Delivered", "Pending", "Canceled"],
            datasets: [
              {
                data: [20, 35, 12, 15],
                backgroundColor: [blue, green, teal, red],
                borderWidth: 0,
                hoverOffset: 6,
              },
            ],
          },
          options: {
            cutout: "68%",
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { displayColors: false, backgroundColor: "#004ed6", bodyFont: { family: "Rubik", size: 12 }, callbacks: { title: () => "", label: (i) => i.label + ": " + i.formattedValue } },
            },
          },
        })
      );
    }

    // Earning / total overview (pie)
    const overview = document.getElementById("overviewChart");
    if (overview) {
      const labels = (overview.dataset.labels || "Available,Withdraw,Pending").split(",");
      const prefix = overview.dataset.prefix || "";
      instances.push(
        new Chart(overview, {
          type: "pie",
          data: {
            labels: labels,
            datasets: [
              {
                data: [34, 50, 16],
                backgroundColor: [blue, green, teal],
                borderWidth: 0,
                hoverOffset: 10,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            layout: { padding: 10 },
            plugins: {
              legend: { display: false },
              tooltip: { displayColors: false, backgroundColor: "#1a9e63", bodyFont: { family: "Rubik", size: 12 }, callbacks: { title: () => "", label: (i) => i.label + ": " + prefix + i.formattedValue } },
            },
          },
        })
      );
    }

    // Re-color axes when the theme changes
    $(document).on("cs:themechange", function () {
      const c = palette();
      instances.forEach(function (chart) {
        if (chart.options.scales && chart.options.scales.x) {
          chart.options.scales.x.ticks.color = c.text;
          chart.options.scales.y.ticks.color = c.text;
          chart.options.scales.y.grid.color = c.grid;
          Object.assign(chart.options.plugins.tooltip, {
            backgroundColor: c.card,
            titleColor: c.heading,
            bodyColor: c.text,
            borderColor: c.grid,
          });
        }
        chart.update();
      });
    });
  }
})(jQuery);
