/**
 * angular-mailchimp
 * http://github.com/keithio/angular-mailchimp
 * License: MIT
 */

'use strict';

/**
 * Form controller for a new Mailchimp subscription.
 */

var mailchimpSubscriptionControllers = angular.module('mailchimpSubscriptionControllers', []);

  /**
   * Form controller for a new Mailchimp subscription.
   */
mailchimpSubscriptionControllers.controller('MailchimpSubscriptionCtrl', ['$log', '$resource', '$scope', function MailchimpSubscriptionCtrl($log, $resource, $scope) {
  // Handle clicks on the form submission.
  $scope.addSubscription = function (mailchimp) {
    var actions,
        MailChimpSubscription,
        params,
        url;

    // Create a resource for interacting with the MailChimp API
    url = '//' + mailchimp.username + '.' + mailchimp.dc + '.list-manage.com/subscribe/post-json';
    params = {
      'EMAIL': mailchimp.email,
      'FNAME': mailchimp.fname,
      'LNAME': mailchimp.lname,
      'c': 'JSON_CALLBACK',
      'u': mailchimp.u,
      'id': mailchimp.id
    };
    actions = {
      'save': {
        method: 'jsonp'
      }
    };
    MailChimpSubscription = $resource(url, params, actions);

    // mailchimp.successMessage = "Almost finished... We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.";
    // Send subscriber data to MailChimp
    MailChimpSubscription.save(
      // Successfully sent data to MailChimp.
      function (response) {
        // Define message containers.
        mailchimp.resultMessage = '';

        // Store the result from MailChimp
        mailchimp.result = response.result;

        // Mailchimp returned an error.
        if (response.result === 'error') {
          if (response.msg) {
            // Remove error numbers, if any.
            var errorMessageParts = response.msg.split(' - ');
            if (errorMessageParts.length > 1)
              errorMessageParts.shift(); // Remove the error number
            mailchimp.errorMessage = errorMessageParts.join(' ');
            mailchimp.resultMessage = mailchimp.errorMessage;
          } else {
            mailchimp.resultMessage = 'Sorry! An unknown error occured.';
          }
        }
        // MailChimp returns a success.
        else if (response.result === 'success') {
          mailchimp.resultMessage = response.msg;
        }
      },

      // Error sending data to MailChimp
      function (error) {
        $log.error('MailChimp Error: %o', error);
      }
    );
  };
}]);
