(function ($) {
  "use strict";

  /*
  |--------------------------------------------------------------------------
  | Template Name: Shopily
  | Author: Laralink
  | Version: 1.0.0
  |--------------------------------------------------------------------------
  |--------------------------------------------------------------------------
  | TABLE OF CONTENTS:
  |--------------------------------------------------------------------------
  |
  | 01. Preloader
  | 02. Mobile Menu
  | 03. Sticky Header
  | 04. Header Dropdowns (language, account, all categories)
  | 05. Light / Dark Mode Toggle
  | 06. Sidebar Menu
  | 07. Dynamic Background
  | 08. Swiper Slider
  | 09. Modal Video
  | 10. Scroll Up
  | 11. Accordion
  | 12. Review
  | 13. Counter Animation
  | 14. Offer Countdown Timer
  | 15. Tabs
  | 16. List And Grid View
  | 17. Increment Decrement
  | 18. Cart Drawer Open / Close
  | 19. Floating Filter Open / Close
  | 20. Review Option Open / Close
  | 21. Address Modal Open / Close
  | 22. Add Card Modal Open / Close
  | 23. Image Zoom
  | 24. Progress Bar
  | 25. Coupon Code Copy
  | 26. Liquor Age Confirm Modal
  | 27. AOS Animation
  |
  */

  /*--------------------------------------------------------------
    Scripts initialization
  --------------------------------------------------------------*/
  $.exists = function (selector) {
    return $(selector).length > 0;
  };

  $(window).on("scroll", function () {
    stickyHeader();
    showScrollUp();
  });

  $(function () {
    mainNav();
    stickyHeader();
    headerDropdown();
    themeModeToggle();
    sidebarMenu();
    dynamicBackground();
    swiperInit();
    modalVideo();
    scrollUp();
    offerCountdownTimer();
    tabs();
    //accordion();
    review();
    //counterInit();
    listAndGridView();
    incrementDecrement();
    cartDrawerToggle();
    filterOptionToggle();
    imageZoom();
    reviewOptionToggle();
    addressModalToggle();
    cardModalToggle();
    progressBar();
    copyCouponCode();
    ageConfirmModal();
    //aosInit();
    $(".tom_select").each(function () {
      new TomSelect(this, {
        create: false,
        onDropdownOpen: function (dropdown) {
          dropdown.classList.add("active");
        },
        onDropdownClose: function (dropdown) {
          dropdown.classList.remove("active");
        },
      });
    });
    if ($.exists(".cs_getting_year")) {
      const date = new Date();
      $(".cs_getting_year").text(date.getFullYear());
    }
  });

  /*=============================================================
    01. Preloader
  ===============================================================*/
  // function preloader() {
  //   $(".cs_preloader_in").fadeOut();
  //   $(".cs_preloader").delay(150).fadeOut("slow");
  // }
  /*=============================================================
    02. Mobile Menu
  ===============================================================*/
  function mainNav() {
    $(".cs_nav").append('<span class="cs_menu_toggle"><span></span></span>');
    $(".menu-item-has-children").append(
      '<span class="cs_menu_dropdown_toggle"><span></span></span>',
    );
    $(".cs_menu_toggle").on("click", function () {
      $(this)
        .toggleClass("active")
        .siblings(".cs_nav_list_wrap")
        .toggleClass("active");
      $(".cs_site_header").toggleClass("active");
    });
    $(".cs_menu_dropdown_toggle").on("click", function () {
      $(this).toggleClass("active").siblings("ul").slideToggle();
      $(this).parent().toggleClass("active");
    });
  }
  /*=============================================================
    03. Sticky Header
  ===============================================================*/
  function stickyHeader() {
    var scroll = $(window).scrollTop();
    if (scroll >= 10) {
      $(".cs_sticky_header").addClass("cs_sticky_active");
    } else {
      $(".cs_sticky_header").removeClass("cs_sticky_active");
    }
  }
  /*=============================================================
    04. Header Dropdowns (language, account, all categories)
  ===============================================================*/
  function headerDropdown() {
    $(".cs_header_dropdown_btn").on("click", function (e) {
      const $wrap = $(this).closest(".cs_header_dropdown_wrap");
      e.preventDefault();
      e.stopPropagation();
      $(".cs_header_dropdown_wrap.active").not($wrap).removeClass("active");
      $wrap.toggleClass("active");
      $(this).attr("aria-expanded", $wrap.hasClass("active"));
    });
    $(document).on("click", function (e) {
      if (!$(e.target).closest(".cs_header_dropdown_wrap").length) {
        $(".cs_header_dropdown_wrap.active")
          .removeClass("active")
          .find(".cs_header_dropdown_btn")
          .attr("aria-expanded", false);
      }
    });
  }
  /*=============================================================
    05. Light / Dark Mode Toggle
  ===============================================================*/
  function themeModeToggle() {
    const storageKey = "shopily-theme";
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem(storageKey);
    } catch (e) {}
    if (savedTheme === "dark") {
      $("body").addClass("cs_dark");
    } else if (savedTheme === "light") {
      $("body").removeClass("cs_dark");
    }
    $(".cs_mode_toggle").attr("aria-pressed", $("body").hasClass("cs_dark"));
    $(".cs_mode_toggle").on("click", function () {
      const isDark = $("body").toggleClass("cs_dark").hasClass("cs_dark");
      $(".cs_mode_toggle").attr("aria-pressed", isDark);
      try {
        localStorage.setItem(storageKey, isDark ? "dark" : "light");
      } catch (e) {}
    });
  }
  /*=============================================================
    06. Sidebar Menu
  ===============================================================*/
  function sidebarMenu() {
    $(".sidebar_toggler").on("click", function () {
      $(this)
        .toggleClass("active")
        .html(
          $(this).hasClass("active")
            ? '<i class="fa-solid fa-chevron-left"></i>'
            : '<i class="fa-solid fa-chevron-right"></i>',
        )
        .parent()
        .toggleClass("active");
    });

    $(".cs_side_header .menu-item-has-children > a").on("click", function (e) {
      e.preventDefault();
      $(this).siblings("ul").slideToggle().parent().toggleClass("active");
      $(this)
        .parent()
        .siblings(".menu-item-has-children")
        .removeClass("active")
        .children("ul")
        .slideUp();
    });
  }
  /*=============================================================
    07. Dynamic Background
  ===============================================================*/
  function dynamicBackground() {
    $("[data-src]").each(function () {
      var src = $(this).attr("data-src");
      $(this).css({
        "background-image": "url(" + src + ")",
      });
    });
  }
  /*=============================================================
    08. Swiper Slider
  ===============================================================*/
  function swiperInit() {
    if (typeof Swiper === "undefined") {
      console.warn("Swiper library not loaded");
      return;
    }
    const sliders = document.querySelectorAll(".cs_slider");

    sliders.forEach((slider) => {
      const container = slider.querySelector(".cs_slider_container");
      const swiperWrapper = slider.querySelector(".swiper-wrapper");
      const status = slider.querySelector(".cs_slider_number");
      if (!container || !swiperWrapper) {
        return;
      }

      // Read data attributes
      let autoPlayVar =
        parseInt(container.getAttribute("data-autoplay"), 10) || 0;
      let autoplaySpdVar = 6000; // default
      if (autoPlayVar > 1) {
        autoplaySpdVar = autoPlayVar;
        autoPlayVar = 1;
      }

      const speedVar =
        parseInt(container.getAttribute("data-speed"), 10) || 600;
      const loopVar = Boolean(
        parseInt(container.getAttribute("data-loop"), 10),
      );
      const centerVar = Boolean(
        parseInt(container.getAttribute("data-center"), 10),
      );
      const fadeVar = parseInt(container.getAttribute("data-fade-slide")) === 1;

      let slidesPerView =
        parseInt(container.getAttribute("data-slides-per-view"), 10) || 3;

      // Gap value
      let gapVar = parseInt(container.getAttribute("data-gap"), 10);
      if (isNaN(gapVar)) {
        gapVar = 24; // fallback
      }

      // Responsive breakpoints
      let breakpoints = {};
      if (container.getAttribute("data-slides-per-view") === "responsive") {
        const xxl =
          parseInt(container.getAttribute("data-xxl-slides"), 10) || 3;
        const xl = parseInt(container.getAttribute("data-xl-slides"), 10) || 3;
        const lg = parseInt(container.getAttribute("data-lg-slides"), 10) || 3;
        const md = parseInt(container.getAttribute("data-md-slides"), 10) || 2;
        const sm = parseInt(container.getAttribute("data-sm-slides"), 10) || 1;
        const xs = parseInt(container.getAttribute("data-xs-slides"), 10) || 1;

        // Responsive gaps (optional, if provided)
        const xxlGap =
          parseInt(container.getAttribute("data-xxl-gap"), 10) || gapVar;
        const xlGap =
          parseInt(container.getAttribute("data-xl-gap"), 10) || gapVar;
        const lgGap =
          parseInt(container.getAttribute("data-lg-gap"), 10) || gapVar;
        const mdGap =
          parseInt(container.getAttribute("data-md-gap"), 10) || gapVar;
        const smGap =
          parseInt(container.getAttribute("data-sm-gap"), 10) || gapVar;
        const xsGap =
          parseInt(container.getAttribute("data-xs-gap"), 10) || gapVar;

        breakpoints = {
          1400: { slidesPerView: xxl, spaceBetween: xxlGap },
          1200: { slidesPerView: xl, spaceBetween: xlGap },
          1024: { slidesPerView: lg, spaceBetween: lgGap },
          768: { slidesPerView: md, spaceBetween: mdGap },
          575: { slidesPerView: sm, spaceBetween: smGap },
          0: { slidesPerView: xs, spaceBetween: xsGap },
        };
        slidesPerView =
          parseInt(container.getAttribute("data-add-slides"), 10) || 3;
      }

      // Navigation & pagination
      const nextEl = slider.querySelector(".cs_right_arrow");
      const prevEl = slider.querySelector(".cs_left_arrow");
      const paginationEl = slider.querySelector(".swiper-pagination");
      const hasPagination = paginationEl !== null;

      // Initialize Swiper
      const swiper = new Swiper(container, {
        loop: loopVar,
        speed: speedVar,
        slidesPerView: slidesPerView,
        slidesPerGroup: 1,
        spaceBetween: gapVar, // 👈 dynamic gap
        centeredSlides: centerVar,
        effect: fadeVar ? "fade" : "slide",
        autoplay: autoPlayVar
          ? { delay: autoplaySpdVar, disableOnInteraction: false }
          : false,
        navigation: {
          nextEl: nextEl,
          prevEl: prevEl,
        },
        pagination: hasPagination ? { el: paginationEl, clickable: true } : {},
        breakpoints: breakpoints,
        on: {
          init: function () {
            if (status) {
              const current = this.realIndex + 1;
              const total =
                this.slides.length - (loopVar ? this.loopedSlides * 2 : 0);
              status.innerHTML = `
              <span class="cs_current_number" data-number="${current}"><span>${current}</span></span>
              <span class="cs_slider_number_seperator"></span>
              <span class="cs_total_numbers" data-number="${total}"><span>${total}</span></span>
            `;
            }
          },
          slideChange: function () {
            if (status) {
              const current = this.realIndex + 1;
              const total =
                this.slides.length - (loopVar ? this.loopedSlides * 2 : 0);
              status.innerHTML = `
              <span class="cs_current_number" data-number="${current}"><span>${current}</span></span>
              <span class="cs_slider_number_seperator"></span>
              <span class="cs_total_numbers" data-number="${total}"><span>${total}</span></span>
            `;
            }
          },
        },
      });
    });

    // Product Single Slider
    if ($(".cs_single_product_slider").length > 0) {
      // Initialize Thumbnail slider first
      const propertyNav = new Swiper(".cs_single_product_nav", {
        spaceBetween: 20,
        slidesPerView: 5,
        freeMode: true,
        navigation: false,
        watchSlidesProgress: true,
        breakpoints: {
          320: {
            slidesPerView: 3,
            spaceBetween: 10,
          },

          450: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 5,
            spaceBetween: 20,
          },

          1024: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        },
      });

      // Initialize Main slider with connection to thumbnails
      new Swiper(".cs_single_product_slider", {
        spaceBetween: 0,
        slidesPerView: 1,
        effect: "slide",
        fadeEffect: {
          crossFade: true,
        },
        thumbs: {
          swiper: propertyNav,
        },
        loop: false,
        autoplay: false,
      });
    }
  }
  /*=============================================================
    09. Modal Video
  ===============================================================*/
  function modalVideo() {
    if ($.exists(".cs_video_open")) {
      $("body").append(`
        <div class="cs_video_popup">
          <div class="cs_video_popup-overlay"></div>
          <div class="cs_video_popup-content">
            <div class="cs_video_popup-layer"></div>
            <div class="cs_video_popup_container">
              <div class="cs_video_popup-align">
                <div class="embed-responsive embed-responsive-16by9">
                  <iframe class="embed-responsive-item" src="about:blank"></iframe>
                </div>
              </div>
              <div class="cs_video_popup_close"></div>
            </div>
          </div>
        </div>
      `);
      $(document).on("click", ".cs_video_open", function (e) {
        e.preventDefault();
        var video = $(this).attr("href");

        $(".cs_video_popup_container iframe").attr("src", `${video}`);

        $(".cs_video_popup").addClass("active");
      });
      $(".cs_video_popup_close, .cs_video_popup-layer").on(
        "click",
        function (e) {
          $(".cs_video_popup").removeClass("active");
          $("html").removeClass("overflow-hidden");
          $(".cs_video_popup_container iframe").attr("src", "about:blank");
          e.preventDefault();
        },
      );
    }
  }
  /*=============================================================
    10. Scroll Up
  ===============================================================*/
  function scrollUp() {
    $(".cs_scrollup").on("click", function (e) {
      e.preventDefault();
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        0,
      );
    });
  }
  /* For Scroll Up */
  function showScrollUp() {
    let scroll = $(window).scrollTop();
    if (scroll >= 350) {
      $(".cs_scrollup").addClass("active");
    } else {
      $(".cs_scrollup").removeClass("active");
    }
  }
  /*=============================================================
    11. Accordion
  ===============================================================*/
  // function accordian() {
  //   $(".cs_accordian").children(".cs_accordian_body").hide();
  //   $(".cs_accordian.active").children(".cs_accordian_body").show();
  //   $(".cs_accordian_head").on("click", function () {
  //     $(this)
  //       .siblings()
  //       .slideDown(250)
  //       .parent(".cs_accordian")
  //       .siblings()
  //       .children(".cs_accordian_body")
  //       .slideUp(250);

  //     /* Accordian Active Class */
  //     $(this).parents(".cs_accordian").addClass("active");
  //     $(this).parent(".cs_accordian").siblings().removeClass("active");
  //   });
  // }

  /*=============================================================
    12. Review
  ===============================================================*/
  function review() {
    $(".cs_rating").each(function () {
      var review = $(this).data("rating");
      var reviewVal = review * 20 + "%";
      $(this).find(".cs_rating_percentage").css("width", reviewVal);
    });
    // Customer Feddback Star
    $(".cs_input_rating i").on("click", function () {
      $(this).siblings().removeClass("fa-solid");
      $(this).addClass("fa-solid").prevAll().addClass("fa-solid");
    });
  }

  /*===========================================================
    13. Counter Animation
  =============================================================*/
  // function counterInit() {
  //   if ($.exists(".odometer")) {
  //     $(window).on("scroll", function () {
  //       function winScrollPosition() {
  //         var scrollPos = $(window).scrollTop(),
  //           winHeight = $(window).height();
  //         var scrollPosition = Math.round(scrollPos + winHeight / 1.2);
  //         return scrollPosition;
  //       }

  //       $(".odometer").each(function () {
  //         var elemOffset = $(this).offset().top;
  //         if (elemOffset < winScrollPosition()) {
  //           $(this).html($(this).data("count-to"));
  //         }
  //       });
  //     });
  //   }
  // }

  /*===========================================================
    14. Offer Countdown Timer
  =============================================================*/
  function offerCountdownTimer() {
    const $countdownEl = $(".cs_countdown");
    let endTime = new Date($countdownEl.data("endtime")).getTime();

    const $hoursEl = $countdownEl.find("#cs_hours");
    const $minutesEl = $countdownEl.find("#cs_minutes");
    const $secondsEl = $countdownEl.find("#cs_seconds");

    function updateCountdown() {
      let now = Date.now();
      let countdownTime = endTime - now; // in ms

      if (countdownTime > 0) {
        let hours = Math.floor(
          (countdownTime % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60),
        ); // 0–167 hours
        let minutes = Math.floor(
          (countdownTime % (1000 * 60 * 60)) / (1000 * 60),
        ); // 0–59
        let seconds = Math.floor((countdownTime % (1000 * 60)) / 1000); // 0–59

        $hoursEl.text(hours.toString().padStart(3, "0"));
        $minutesEl.text(minutes.toString().padStart(2, "0"));
        $secondsEl.text(seconds.toString().padStart(2, "0"));
      } else {
        clearInterval(timer);
        $countdownEl.text("Offer Ended");
      }
    }

    let timer = setInterval(updateCountdown, 1000);
    updateCountdown();
  }
  /*===========================================================
    15. Tabs
  =============================================================*/
  function tabs() {
    $(".cs_tab_links a").on("click", function (e) {
      var currentAttrValue = $(this).attr("href");
      //Tab and slider both activation code
      $(".cs_tabs " + currentAttrValue)
        .addClass("active")
        .siblings()
        .removeClass("active");
      $(this).parents("li").addClass("active").siblings().removeClass("active");
      e.preventDefault();
    });
  }
  /*===========================================================
    16. List And Grid View
   ===========================================================*/
  function listAndGridView() {
    $(".cs_list_view").on("click", function () {
      $(this).addClass("active").siblings().removeClass("active");
      $(".cs_products_view")
        .addClass("cs_products_list_style_1")
        .removeClass("cs_products_grid_style_2");
    });

    $(".cs_grid_view").on("click", function () {
      $(this).addClass("active").siblings().removeClass("active");
      $(".cs_products_view")
        .addClass("cs_products_grid_style_2")
        .removeClass("cs_products_list_style_1");
    });
  }
  /*===========================================================
    17. Increment Decrement
  ============================================================*/
  function incrementDecrement() {
    $(".cs_increament").on("click", function () {
      let productQty = $(this).siblings(".cs_quantity_input");
      let count = parseInt(productQty.val()) || 1;
      count++;
      productQty.val(count);
    });

    $(".cs_decreament").on("click", function () {
      let productQty = $(this).siblings(".cs_quantity_input");
      let count = parseInt(productQty.val()) || 1;
      if (count > 1) {
        count--;
        productQty.val(count);
      }
    });
  }
  /*===========================================================
    18. Cart Drawer Open / Close
  ============================================================*/
  function cartDrawerToggle() {
    // Add to cart: only update the header cart count, keep the drawer closed
    $(".cs_add_to_cart_btn, .addToCartButton").on("click", function (e) {
      e.preventDefault();
      $(".cs_header_cart_count").each(function () {
        const count = parseInt($(this).text(), 10) || 0;
        $(this).text(count + 1);
      });
    });

    // Header cart icon: open the drawer (falls back to cart page if no drawer)
    $(".cs_header_cart").on("click", function (e) {
      if ($(".cs_fullscreen_cart").length) {
        e.preventDefault();
        $(".cs_fullscreen_cart").addClass("active");
        $("body").addClass("hidden");
      }
    });

    $("#cartCloseButton, .cs_cart_overlay").on("click", function () {
      $(".cs_fullscreen_cart").removeClass("active");
      $("body").removeClass("hidden");
    });
  }
  /*===========================================================
    19. Floating Filter Open / Close
  ============================================================*/
  function filterOptionToggle() {
    $("#openFilterBtn").on("click", function () {
      $(".cs_fullscreen_filter").addClass("active");
      $("body").addClass("hidden");
    });

    $("#filterCloseButton, .cs_filter_overlay").on("click", function () {
      $(".cs_fullscreen_filter").removeClass("active");
      $("body").removeClass("hidden");
    });
  }
  /*===========================================================
    20. Review Option Open / Close
  ============================================================*/
  function reviewOptionToggle() {
    $("#openReviewBtn, .openReviewBtn").on("click", function () {
      $("#reviewModal").addClass("active");
      $("body").addClass("hidden");
    });

    $("#reviewCloseButton, .cs_review_overlay").on("click", function () {
      $("#reviewModal").removeClass("active");
      $("body").removeClass("hidden");
    });
  }
  /*===========================================================
    21. Address Modal Open / Close
  ============================================================*/
  function addressModalToggle() {
    $("#addressModalBtn").on("click", function () {
      $("#addressModal").addClass("active");
      $("body").addClass("hidden");
    });

    $(".closeAddressModal").on("click", function () {
      $(".cs_address_modal").removeClass("active");
      $("body").removeClass("hidden");
    });
  }
  /*===========================================================
    22. Add Card Modal Open / Close
  ============================================================*/
  function cardModalToggle() {
    $("#addCardModalBtn").on("click", function () {
      $("#cardModal").addClass("active");
      $(this).find(".cs_custom_checkbox input").prop("checked", true);
      $("body").addClass("hidden");
    });

    $(".closeCardModal").on("click", function () {
      $("#cardModal").removeClass("active");
      $("body").removeClass("hidden");
    });
  }
  /*===========================================================
    23. Image Zoom
  ============================================================*/
  function imageZoom() {
    $(".cs_zoom_plus").zoom({
      cursor: "zoom-in",
    });
  }

  /*===========================================================
    24. Progress Bar
  ===========================================================*/
  function progressBar() {
    $(".cs_progress").each(function () {
      var progressPercentage = $(this).data("progress") + "%";
      $(this).find(".cs_progress_in").css("width", progressPercentage);
    });
  }
  /*===========================================================
    25. Coupon Code Copy
  ===========================================================*/
  function copyCouponCode() {
    $(".cs_coupon_btn").on("click", function () {
      var couponCode = $(this).val();

      // Copy to clipboard
      navigator.clipboard.writeText(couponCode).then(() => {
        // Show tooltip message
        showTooltip($(this), "Copied: " + couponCode);
      });
    });

    function showTooltip(element, message) {
      // Remove existing tooltip if any
      $(".cs_tooltip").remove();

      // Create tooltip element
      const tooltip = $("<span class='cs_tooltip'>" + message + "</span>");
      $("body").append(tooltip);

      // Fade in tooltip and remove after 2 seconds
      tooltip
        .fadeIn(200)
        .delay(2000)
        .fadeOut(300, function () {
          $(this).remove();
        });
    }
    $("#couponCodeToggler").on("click", function () {
      $(this).siblings(".cs_coupon_code_container").slideToggle(250);
    });
  }

  /*=============================================================
    26. Liquor Age Confirm Modal
  ===============================================================*/
  function ageConfirmModal() {
    if ($("#ageConfirmModal").length) {
      const storageKey = "liquorAgeVerified";
      const $modal = $("#ageConfirmModal");
      const $buttons = $modal.find(".cs_age_modal_btn");
      let verified = false;
      try {
        verified = localStorage.getItem(storageKey) === "true";
      } catch (e) {}
      if (verified) return;

      $modal.addClass("active").attr("aria-hidden", "false");
      $("html, body").addClass("cs_age_modal_open");
      $buttons.first().trigger("focus");

      // Keep keyboard focus inside the dialog while it is open
      $modal.on("keydown", function (e) {
        if (e.key !== "Tab") return;
        const first = $buttons.first()[0];
        const last = $buttons.last()[0];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });

      $("#ageConfirmYes").on("click", function () {
        try {
          localStorage.setItem(storageKey, "true");
        } catch (e) {}
        $modal.removeClass("active").attr("aria-hidden", "true");
        $("html, body").removeClass("cs_age_modal_open");
      });

      $("#ageConfirmNo").on("click", function () {
        window.location.href = "../index.html";
      });
    }
  }

  /*=============================================================
    27. AOS Animation
  ===============================================================*/
  // function aosInit() {
  //   AOS.init({
  //     offset: 100,
  //     duration: 800,
  //     easing: "ease-in-out",
  //     once: true,
  //     mirror: false,
  //   });
  // }
})(jQuery); // End of use strict
