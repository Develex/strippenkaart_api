"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["app"],{

/***/ "./assets/js/app.js":
/*!**************************!*\
  !*** ./assets/js/app.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/dist/js.cookie.mjs");

$(document).ready(function () {
  var baseURL = "http://127.0.0.1:8000";
  var apiBaseURL = "/api/v1/"; //remove access_token from localstorage when leaving page

  window.onbeforeunload = function () {
    localStorage.removeItem('access_token');
  }; //check if access_token exists


  if (window.localStorage.getItem("access_token") != null) {
    $(".logged-out-container").hide();
  } else {
    $('.logged-in-container').hide();
  } //toggle for burger menu


  $(".navbar-burger").click(function () {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
  $("#login-modal .modal-close, .login,#login-modal .modal-background").click(function () {
    $("#login-modal").toggleClass("is-active");
  });
  $("#register-modal .modal-close, .register,#register-modal .modal-background").click(function () {
    $("#register-modal").toggleClass("is-active");
  });
  $("#login-form").submit(function (e) {
    e.preventDefault();
    fetch(baseURL + apiBaseURL + 'auth/login', {
      method: 'POST',
      headers: {
        Authorization: "Basic " + btoa($('#login-form input[name=email]').val() + ":" + $('#login-form input[name=password]').val())
      }
    }).then(function (response) {
      return response.json();
    }).then(function (result) {
      //saves access_token in localstorage
      window.localStorage.setItem("access_token", result["access_token"]); //swaps login and logout buttons

      toggleButtons(); //closes login modal

      $("#login-modal").toggleClass("is-active");
    })["catch"](function (error) {
      return console.log("Error: " + error);
    });
  });
  $('.logout').click(function (e) {
    window.localStorage.removeItem("access_token");
    toggleButtons(); //go back to home page

    window.location.replace(baseURL + "/dashboard");
  });

  function toggleButtons() {
    $(".logged-out-container").toggle();
    $(".logged-in-container").toggle();
  }
});

/***/ }),

/***/ "./node_modules/js-cookie/dist/js.cookie.mjs":
/*!***************************************************!*\
  !*** ./node_modules/js-cookie/dist/js.cookie.mjs ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*! js-cookie v3.0.1 | MIT */
/* eslint-disable no-var */
function assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (key, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    key = encodeURIComponent(key)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      key + '=' + converter.write(value, key) + stringifiedAttributes)
  }

  function get (key) {
    if (typeof document === 'undefined' || (arguments.length && !key)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var foundKey = decodeURIComponent(parts[0]);
        jar[foundKey] = converter.read(value, foundKey);

        if (key === foundKey) {
          break
        }
      } catch (e) {}
    }

    return key ? jar[key] : jar
  }

  return Object.create(
    {
      set: set,
      get: get,
      remove: function (key, attributes) {
        set(
          key,
          '',
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });
/* eslint-enable no-var */

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (api);


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./assets/js/app.js"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q1A7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQSxLQUFLO0FBQ0w7QUFDQSxvQkFBb0IseUNBQXlDO0FBQzdELG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7O0FBRUEsbUNBQW1DLFdBQVc7QUFDOUM7O0FBRUEsaUVBQWUsR0FBRyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanMtY29va2llL2Rpc3QvanMuY29va2llLm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ29va2llcyBmcm9tIFwianMtY29va2llXCI7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICAgIGNvbnN0IGJhc2VVUkwgPSBcImh0dHA6Ly8xMjcuMC4wLjE6ODAwMFwiO1xuICAgIGNvbnN0IGFwaUJhc2VVUkwgPSBcIi9hcGkvdjEvXCI7XG5cblxuICAgIC8vcmVtb3ZlIGFjY2Vzc190b2tlbiBmcm9tIGxvY2Fsc3RvcmFnZSB3aGVuIGxlYXZpbmcgcGFnZVxuICAgIHdpbmRvdy5vbmJlZm9yZXVubG9hZCA9ICgpID0+IHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2FjY2Vzc190b2tlbicpO1xuICAgIH1cblxuICAgIC8vY2hlY2sgaWYgYWNjZXNzX3Rva2VuIGV4aXN0c1xuICAgIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2Nlc3NfdG9rZW5cIikgIT0gbnVsbCkge1xuICAgICAgICAkKFwiLmxvZ2dlZC1vdXQtY29udGFpbmVyXCIpLmhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKCcubG9nZ2VkLWluLWNvbnRhaW5lcicpLmhpZGUoKTtcbiAgICB9XG5cbiAgICAvL3RvZ2dsZSBmb3IgYnVyZ2VyIG1lbnVcbiAgICAkKFwiLm5hdmJhci1idXJnZXJcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAkKFwiLm5hdmJhci1idXJnZXJcIikudG9nZ2xlQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG4gICAgICAgICQoXCIubmF2YmFyLW1lbnVcIikudG9nZ2xlQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG4gICAgfSk7XG5cbiAgICAkKFwiI2xvZ2luLW1vZGFsIC5tb2RhbC1jbG9zZSwgLmxvZ2luLCNsb2dpbi1tb2RhbCAubW9kYWwtYmFja2dyb3VuZFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoXCIjbG9naW4tbW9kYWxcIikudG9nZ2xlQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG4gICAgfSk7XG5cbiAgICAkKFwiI3JlZ2lzdGVyLW1vZGFsIC5tb2RhbC1jbG9zZSwgLnJlZ2lzdGVyLCNyZWdpc3Rlci1tb2RhbCAubW9kYWwtYmFja2dyb3VuZFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoXCIjcmVnaXN0ZXItbW9kYWxcIikudG9nZ2xlQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG4gICAgfSk7XG5cbiAgICAkKFwiI2xvZ2luLWZvcm1cIikuc3VibWl0KGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBmZXRjaChiYXNlVVJMICsgYXBpQmFzZVVSTCArICdhdXRoL2xvZ2luJywge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbjogXCJCYXNpYyBcIisgYnRvYSgkKCcjbG9naW4tZm9ybSBpbnB1dFtuYW1lPWVtYWlsXScpLnZhbCgpICsgXCI6XCIgKyAkKCcjbG9naW4tZm9ybSBpbnB1dFtuYW1lPXBhc3N3b3JkXScpLnZhbCgpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAvL3NhdmVzIGFjY2Vzc190b2tlbiBpbiBsb2NhbHN0b3JhZ2VcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2Nlc3NfdG9rZW5cIiwgcmVzdWx0W1wiYWNjZXNzX3Rva2VuXCJdKTtcbiAgICAgICAgICAgICAgICAvL3N3YXBzIGxvZ2luIGFuZCBsb2dvdXQgYnV0dG9uc1xuICAgICAgICAgICAgICAgIHRvZ2dsZUJ1dHRvbnMoKTtcbiAgICAgICAgICAgICAgICAvL2Nsb3NlcyBsb2dpbiBtb2RhbFxuICAgICAgICAgICAgICAgICQoXCIjbG9naW4tbW9kYWxcIikudG9nZ2xlQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4gY29uc29sZS5sb2coXCJFcnJvcjogXCIrIGVycm9yKSlcbiAgICB9KTtcblxuICAgICQoJy5sb2dvdXQnKS5jbGljayhmdW5jdGlvbiAoZSkge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2Nlc3NfdG9rZW5cIik7XG4gICAgICAgIHRvZ2dsZUJ1dHRvbnMoKTtcbiAgICAgICAgLy9nbyBiYWNrIHRvIGhvbWUgcGFnZVxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZShiYXNlVVJMICsgXCIvZGFzaGJvYXJkXCIpXG4gICAgfSlcblxuICAgIGZ1bmN0aW9uIHRvZ2dsZUJ1dHRvbnMoKXtcbiAgICAgICAgJChcIi5sb2dnZWQtb3V0LWNvbnRhaW5lclwiKS50b2dnbGUoKTtcbiAgICAgICAgJChcIi5sb2dnZWQtaW4tY29udGFpbmVyXCIpLnRvZ2dsZSgpO1xuICAgIH1cblxuXG5cbn0pOyIsIi8qISBqcy1jb29raWUgdjMuMC4xIHwgTUlUICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbmZ1bmN0aW9uIGFzc2lnbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7XG4gICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0XG59XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXZhciAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby12YXIgKi9cbnZhciBkZWZhdWx0Q29udmVydGVyID0ge1xuICByZWFkOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodmFsdWVbMF0gPT09ICdcIicpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMSwgLTEpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvKCVbXFxkQS1GXXsyfSkrL2dpLCBkZWNvZGVVUklDb21wb25lbnQpXG4gIH0sXG4gIHdyaXRlOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKS5yZXBsYWNlKFxuICAgICAgLyUoMlszNDZCRl18M1tBQy1GXXw0MHw1W0JERV18NjB8N1tCQ0RdKS9nLFxuICAgICAgZGVjb2RlVVJJQ29tcG9uZW50XG4gICAgKVxuICB9XG59O1xuLyogZXNsaW50LWVuYWJsZSBuby12YXIgKi9cblxuLyogZXNsaW50LWRpc2FibGUgbm8tdmFyICovXG5cbmZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlciwgZGVmYXVsdEF0dHJpYnV0ZXMpIHtcbiAgZnVuY3Rpb24gc2V0IChrZXksIHZhbHVlLCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGF0dHJpYnV0ZXMgPSBhc3NpZ24oe30sIGRlZmF1bHRBdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcblxuICAgIGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gbmV3IERhdGUoRGF0ZS5ub3coKSArIGF0dHJpYnV0ZXMuZXhwaXJlcyAqIDg2NGU1KTtcbiAgICB9XG4gICAgaWYgKGF0dHJpYnV0ZXMuZXhwaXJlcykge1xuICAgICAgYXR0cmlidXRlcy5leHBpcmVzID0gYXR0cmlidXRlcy5leHBpcmVzLnRvVVRDU3RyaW5nKCk7XG4gICAgfVxuXG4gICAga2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KGtleSlcbiAgICAgIC5yZXBsYWNlKC8lKDJbMzQ2Ql18NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudClcbiAgICAgIC5yZXBsYWNlKC9bKCldL2csIGVzY2FwZSk7XG5cbiAgICB2YXIgc3RyaW5naWZpZWRBdHRyaWJ1dGVzID0gJyc7XG4gICAgZm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAoIWF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZV0pIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgc3RyaW5naWZpZWRBdHRyaWJ1dGVzICs9ICc7ICcgKyBhdHRyaWJ1dGVOYW1lO1xuXG4gICAgICBpZiAoYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyBDb25zaWRlcnMgUkZDIDYyNjUgc2VjdGlvbiA1LjI6XG4gICAgICAvLyAuLi5cbiAgICAgIC8vIDMuICBJZiB0aGUgcmVtYWluaW5nIHVucGFyc2VkLWF0dHJpYnV0ZXMgY29udGFpbnMgYSAleDNCIChcIjtcIilcbiAgICAgIC8vICAgICBjaGFyYWN0ZXI6XG4gICAgICAvLyBDb25zdW1lIHRoZSBjaGFyYWN0ZXJzIG9mIHRoZSB1bnBhcnNlZC1hdHRyaWJ1dGVzIHVwIHRvLFxuICAgICAgLy8gbm90IGluY2x1ZGluZywgdGhlIGZpcnN0ICV4M0IgKFwiO1wiKSBjaGFyYWN0ZXIuXG4gICAgICAvLyAuLi5cbiAgICAgIHN0cmluZ2lmaWVkQXR0cmlidXRlcyArPSAnPScgKyBhdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdLnNwbGl0KCc7JylbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIChkb2N1bWVudC5jb29raWUgPVxuICAgICAga2V5ICsgJz0nICsgY29udmVydGVyLndyaXRlKHZhbHVlLCBrZXkpICsgc3RyaW5naWZpZWRBdHRyaWJ1dGVzKVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0IChrZXkpIHtcbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fCAoYXJndW1lbnRzLmxlbmd0aCAmJiAha2V5KSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gVG8gcHJldmVudCB0aGUgZm9yIGxvb3AgaW4gdGhlIGZpcnN0IHBsYWNlIGFzc2lnbiBhbiBlbXB0eSBhcnJheVxuICAgIC8vIGluIGNhc2UgdGhlcmUgYXJlIG5vIGNvb2tpZXMgYXQgYWxsLlxuICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llID8gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7ICcpIDogW107XG4gICAgdmFyIGphciA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHBhcnRzID0gY29va2llc1tpXS5zcGxpdCgnPScpO1xuICAgICAgdmFyIHZhbHVlID0gcGFydHMuc2xpY2UoMSkuam9pbignPScpO1xuXG4gICAgICB0cnkge1xuICAgICAgICB2YXIgZm91bmRLZXkgPSBkZWNvZGVVUklDb21wb25lbnQocGFydHNbMF0pO1xuICAgICAgICBqYXJbZm91bmRLZXldID0gY29udmVydGVyLnJlYWQodmFsdWUsIGZvdW5kS2V5KTtcblxuICAgICAgICBpZiAoa2V5ID09PSBmb3VuZEtleSkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuXG4gICAgcmV0dXJuIGtleSA/IGphcltrZXldIDogamFyXG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShcbiAgICB7XG4gICAgICBzZXQ6IHNldCxcbiAgICAgIGdldDogZ2V0LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAoa2V5LCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHNldChcbiAgICAgICAgICBrZXksXG4gICAgICAgICAgJycsXG4gICAgICAgICAgYXNzaWduKHt9LCBhdHRyaWJ1dGVzLCB7XG4gICAgICAgICAgICBleHBpcmVzOiAtMVxuICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgd2l0aEF0dHJpYnV0ZXM6IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHJldHVybiBpbml0KHRoaXMuY29udmVydGVyLCBhc3NpZ24oe30sIHRoaXMuYXR0cmlidXRlcywgYXR0cmlidXRlcykpXG4gICAgICB9LFxuICAgICAgd2l0aENvbnZlcnRlcjogZnVuY3Rpb24gKGNvbnZlcnRlcikge1xuICAgICAgICByZXR1cm4gaW5pdChhc3NpZ24oe30sIHRoaXMuY29udmVydGVyLCBjb252ZXJ0ZXIpLCB0aGlzLmF0dHJpYnV0ZXMpXG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBhdHRyaWJ1dGVzOiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKGRlZmF1bHRBdHRyaWJ1dGVzKSB9LFxuICAgICAgY29udmVydGVyOiB7IHZhbHVlOiBPYmplY3QuZnJlZXplKGNvbnZlcnRlcikgfVxuICAgIH1cbiAgKVxufVxuXG52YXIgYXBpID0gaW5pdChkZWZhdWx0Q29udmVydGVyLCB7IHBhdGg6ICcvJyB9KTtcbi8qIGVzbGludC1lbmFibGUgbm8tdmFyICovXG5cbmV4cG9ydCBkZWZhdWx0IGFwaTtcbiJdLCJuYW1lcyI6WyJDb29raWVzIiwiJCIsImRvY3VtZW50IiwicmVhZHkiLCJiYXNlVVJMIiwiYXBpQmFzZVVSTCIsIndpbmRvdyIsIm9uYmVmb3JldW5sb2FkIiwibG9jYWxTdG9yYWdlIiwicmVtb3ZlSXRlbSIsImdldEl0ZW0iLCJoaWRlIiwiY2xpY2siLCJ0b2dnbGVDbGFzcyIsInN1Ym1pdCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsImZldGNoIiwibWV0aG9kIiwiaGVhZGVycyIsIkF1dGhvcml6YXRpb24iLCJidG9hIiwidmFsIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsInJlc3VsdCIsInNldEl0ZW0iLCJ0b2dnbGVCdXR0b25zIiwiZXJyb3IiLCJjb25zb2xlIiwibG9nIiwibG9jYXRpb24iLCJyZXBsYWNlIiwidG9nZ2xlIl0sInNvdXJjZVJvb3QiOiIifQ==