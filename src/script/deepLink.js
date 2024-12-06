// Function to populate time slots
function populateTimeDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  const timeSlots = [
    "8:00 AM - 12:00 PM (Morning)",
    "12:00 PM - 4:00 PM (Afternoon)",
    "4:00 PM - 8:00 PM (Evening)",
    "8:00 PM - 11:00 PM (Night)",
  ];

  timeSlots.forEach((time) => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    dropdown.appendChild(option);
  });
}

// Form switching logic
function setupFormSwitcher() {
  const formSelector = document.getElementById("formSelector");
  const normalForm = document.getElementById("normalForm");
  const onBehalfForm = document.getElementById("onBehalfForm");

  formSelector.addEventListener("change", function () {
    const selected = this.value;

    if (selected === "normal") {
      normalForm.style.display = "block";
      onBehalfForm.style.display = "none";
    } else if (selected === "onBehalf") {
      normalForm.style.display = "none";
      onBehalfForm.style.display = "block";
    }
  });

  // Initially hide both forms
  normalForm.style.display = "none";
  onBehalfForm.style.display = "none";
}

// Deep link submission handler
// Deep link submission handler
function submitForm(formType) {
  const baseDeepLink =
    "https://teams.microsoft.com/l/channel/19%3A18ba15fa79fd453eadfa89873dcbeebd%40thread.tacv2/Escalations%20Approval%20Request?groupId=7d496639-9181-41e2-be7e-da9b526bd34c";

  let formattedMessage = "";

  if (formType === "normal") {
    formattedMessage =
      "Name: " +
      document.getElementById("name").value +
      "\n" +
      "Email: " +
      document.getElementById("email").value +
      "\n" +
      "Address: " +
      document.getElementById("address").value +
      "\n" +
      "Best Contact Number/Time: " +
      document.getElementById("contactNumber").value +
      " between " +
      document.getElementById("contactTime").value +
      "\n" +
      "Reason for Escalation: " +
      document.getElementById("reason").value +
      "\n" +
      "FAQs Read: " +
      document.getElementById("faqs").value +
      "\n" +
      "Lead Initials: ";
  } else if (formType === "onBehalf") {
    formattedMessage =
      "Primary Contact: " +
      document.getElementById("primaryContact").value +
      "\n" +
      "Caller Name: " +
      document.getElementById("callerName").value +
      "\n" +
      "Caller Relation to Impacted: " +
      document.getElementById("relation").value +
      "\n" +
      "Impacted Name: " +
      document.getElementById("impactedName").value +
      "\n" +
      "Primary Contact Email: " +
      document.getElementById("primaryEmail").value +
      "\n" +
      "Impacted Address: " +
      document.getElementById("impactedAddress").value +
      "\n" +
      "Primary Contact Best Contact Number/Time: " +
      document.getElementById("primaryContactNumber").value +
      " between " +
      document.getElementById("primaryContactTime").value +
      "\n" +
      "Reason for Escalation: " +
      document.getElementById("reasonEscalation").value +
      "\n" +
      "FAQs Read: " +
      document.getElementById("faqsRead").value +
      "\n" +
      "Lead Initials: ";
  }

  // Display the copied message on the page
  const messageContainer = document.createElement("div");
  messageContainer.style.marginTop = "20px";
  messageContainer.style.padding = "10px";
  messageContainer.style.border = "1px solid lime";
  messageContainer.style.borderRadius = "5px";
  messageContainer.style.backgroundColor = "rgba(0, 255, 0, 0.1)";
  messageContainer.style.color = "lime";
  messageContainer.textContent =
    "Message copied to clipboard:\n\n" + formattedMessage;
  document.body.appendChild(messageContainer);

  // Copy the message to the clipboard
  navigator.clipboard
    .writeText(formattedMessage.trim())
    .then(() => {
      alert(
        "The message has been copied to your clipboard. Microsoft Teams will now open to the Escalations Approvals channel. Click the Start a Post button, enter 'Escalation Request' as the Subject, then in the message field, right click and select paste. Finally, click the Post button and wait for approval from a GPS."
      );
      window.open(baseDeepLink, "_blank");
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}

// Initialize the script
function initialize() {
  populateTimeDropdown("contactTime");
  populateTimeDropdown("primaryContactTime");
  setupFormSwitcher();
}

// Run the initialization when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initialize);
