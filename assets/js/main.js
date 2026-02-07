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
  | 04. Dynamic Background
  | 05. Slick Slider
  | 06. Modal Video
  | 07. Scroll Up
  | 08. Accordian
  | 09. Review
  | 10. Counter Animation
  | 11. Smooth Page Scroll
  | 12. Steps Animation
  | 13. Dynamic contact form
  | 14. AOS Animation
  |
  */

  /*--------------------------------------------------------------
    Scripts initialization
  --------------------------------------------------------------*/
  $.exists = function (selector) {
    return $(selector).length > 0;
  };

  $(window).on("load", function () {});
  $(window).on("scroll", function () {
    stickyHeader();
    showScrollUp();
  });
  $(window).on("resize", function () {});

  $(function () {
    mainNav();
    stickyHeader();
    sidebarMenu();
    dynamicBackground();
    swiperInit();
    modalVideo();
    scrollUp();
    offerCountdownTimer();
    tabs();
    //accordian();
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
    04. Sidebar Menu
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

    $(".menu-item-has-children a").on("click", function (e) {
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
    04. Dynamic Background
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
   05. Swiper Slider
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
    06. Modal Video
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
    07. Scroll Up
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
    08. Accordian
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
    09. Review
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
    10. Counter Animation
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
    12. Offer Countdown Timer Animation
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
    12. Tabs
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
     11. List And Grid View
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
    14. Increment Decrement
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
    14. Cart Drawer Open Close Functionality
  ============================================================*/
  function cartDrawerToggle() {
    $(".cs_add_to_cart_btn, .addToCartButton").on("click", function () {
      $(".cs_fullscreen_cart").addClass("active");
      $("body").addClass("hidden");
    });

    $("#cartCloseButton, .cs_cart_overlay").on("click", function () {
      $(".cs_fullscreen_cart").removeClass("active");
      $("body").removeClass("hidden");
    });
  }
  /*===========================================================
    14. Floating Filter Open Close Functionality
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
    14. Floating Filter Open Close Functionality
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
    14. Address Modal Open Close Functionality
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
    14. Add Card Modal Open Close Functionality
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
    14. Image Zoom Functionality
  ============================================================*/
  function imageZoom() {
    $(".cs_zoom_plus").zoom({
      cursor: "zoom-in",
    });
  }

  /*===========================================================
    9. Progress Bar
  ===========================================================*/
  function progressBar() {
    $(".cs_progress").each(function () {
      var progressPercentage = $(this).data("progress") + "%";
      $(this).find(".cs_progress_in").css("width", progressPercentage);
    });
  }
  /*===========================================================
    9. Coupon Code Copy
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
    14. AOS Animation
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
