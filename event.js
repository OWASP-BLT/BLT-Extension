document.getElementById("upload-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const imageInput = document.getElementById("image-upload");
  const file = imageInput.files[0];

  if (file) {
      const formData = new FormData();
      formData.append("image", file);

      fetch("", {
          method: "POST",
          body: formData
      })
      .then(response => response.json())
      .then(data => {
          console.log("Image uploaded successfully:", data);
      })
      .catch(error => {
          console.error("Error uploading image:", error);
      });
  } else {
      console.log("No file selected.");
  }
});

function cancelForm() {
  // Implement form cancel logic here
}

document.getElementById("report-button").addEventListener("click", function() {
  const reportWrappers = document.getElementsByClassName("report-wrapper");
  const domainWrappers = document.getElementsByClassName("domain-wrapper");

  if (reportWrappers.length > 0 && domainWrappers.length > 0) {
      reportWrappers[0].style.display = "block"; // Display the report section
      domainWrappers[0].style.display = "none";  // Hide the domain section
  } else {
      console.error("Elements with the specified class names not found");
  }

  this.classList.add("active");
  document.getElementById("domain-button").classList.remove("active");
});

document.getElementById("domain-button").addEventListener("click", function() {
  const reportWrappers = document.getElementsByClassName("report-wrapper");
  const domainWrappers = document.getElementsByClassName("domain-wrapper");

  if (reportWrappers.length > 0 && domainWrappers.length > 0) {
      reportWrappers[0].style.display = "none";  // Hide the report section
      domainWrappers[0].style.display = "block"; // Display the domain section
  } else {
      console.error("Elements with the specified class names not found");
  }

  this.classList.add("active");
  document.getElementById("report-button").classList.remove("active");
});
