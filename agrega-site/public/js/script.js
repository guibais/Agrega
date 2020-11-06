/*

Style   : MobApp Script JS
Version : 1.0
Author  : Surjith S M
URI     : https://surjithctly.in/

Copyright © All rights Reserved 

*/

$(function() {
  "use strict";

  /*-----------------------------------
   * FIXED  MENU - HEADER
   *-----------------------------------*/
  function menuscroll() {
    var $navmenu = $(".nav-menu");
    if ($(window).scrollTop() > 50) {
      $navmenu.addClass("is-scrolling");
    } else {
      $navmenu.removeClass("is-scrolling");
    }
  }
  menuscroll();
  $(window).on("scroll", { passive: true }, function() {
    menuscroll();
  });
  /*-----------------------------------
   * NAVBAR CLOSE ON CLICK
   *-----------------------------------*/

  $(".navbar-nav > li:not(.dropdown) > a").on("click", function() {
    $(".navbar-collapse").collapse("hide");
  });
  /*
   * NAVBAR TOGGLE BG
   *-----------------*/
  var siteNav = $("#navbar");
  siteNav.on("show.bs.collapse", function(e) {
    $(this)
      .parents(".nav-menu")
      .addClass("menu-is-open");
  });
  siteNav.on("hide.bs.collapse", function(e) {
    $(this)
      .parents(".nav-menu")
      .removeClass("menu-is-open");
  });

  /*-----------------------------------
   * ONE PAGE SCROLLING
   *-----------------------------------*/
  // Select all links with hashes
  $('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .not('[data-toggle="tab"]')
    .on("click", function(event) {
      // On-page links
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        // Does a scroll target exist?
        if (target.length) {
          // Only prevent default if animation is actually gonna happen
          event.preventDefault();
          $("html, body").animate(
            {
              scrollTop: target.offset().top
            },
            1000,
            function() {
              // Callback after animation
              // Must change focus!
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) {
                // Checking if the target was focused
                return false;
              } else {
                $target.attr("tabindex", "-1"); // Adding tabindex for elements not focusable
                $target.focus(); // Set focus again
              }
            }
          );
        }
      }
    });
  /*-----------------------------------
   * OWL CAROUSEL
   *-----------------------------------*/
  var $testimonialsDiv = $(".testimonials");
  if ($testimonialsDiv.length && $.fn.owlCarousel) {
    $testimonialsDiv.owlCarousel({
      items: 1,
      nav: true,
      dots: false,
      navText: [
        '<span class="ti-arrow-left"></span>',
        '<span class="ti-arrow-right"></span>'
      ]
    });
  }

  var $galleryDiv = $(".img-gallery");
  if ($galleryDiv.length && $.fn.owlCarousel) {
    $galleryDiv.owlCarousel({
      nav: false,
      center: true,
      loop: true,
      autoplay: true,
      dots: true,
      navText: [
        '<span class="ti-arrow-left"></span>',
        '<span class="ti-arrow-right"></span>'
      ],
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 3
        }
      }
    });
  }

  $(function($) {
    $("img.lazy").Lazy();
  });
  var css = "<!-- Global site tag (gtag.js) - Google Analytics -->";
  css +=
    '<script async src="https://www.googletagmanager.com/gtag/js?id=UA-137997447-1"></script>';
  css += "<script>";
  css += "window.dataLayer = window.dataLayer || [];";
  css += "function gtag() { dataLayer.push(arguments); }";
  css += 'gtag("js", new Date()); gtag("config", "UA-137997447-1");';
  css += "</script>";
  css += '<link rel="preload" href="css/style.css" as="style" />';
  css +=
    '<link defer href="https://fonts.googleapis.com/css?family=Rubik:300,400,500"  rel="stylesheet" />';
  css +=
    '<link rel="stylesheet"  defer href="https://unpkg.com/bootstrap@4.3.1/dist/css/bootstrap.min.css" />';
  css +=
    '<link rel="stylesheet" async href="https://unpkg.com/owl.carousel2@2.2.1/dist/assets/owl.carousel.min.css" />';
  css += '<link defer href="css/style.css" rel="stylesheet" />';
  $("head").append(css);

  //   $("header").mousemove(function(e) {
  //     var moveX = e.pageX / 10 - 50;
  //     var moveY = e.pageY / 10;
  //     $(".iphone").css(
  //       "-webkit-transform",
  //       "translate(" + moveX + "px," + moveY + "px)"
  //     );
  //   });
}); /* End Fn */
