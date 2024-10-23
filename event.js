// document.getElementById("upload-form").addEventListener("submit", function(event) {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append("url", document.getElementById("url").value);
//     formData.append("description", document.getElementById("bugTitle").value);
//     formData.append("label" , document.getElementById("labelSelect").value );
//     formData.append("Markdown description" , document.getElementById("description").value);
//     formData.append("screenshots" , document.getElementById("image-upload").files[0]);


//     fetch("http://localhost:8000/api/v1/issues/", {
//         method: "POST",
//         body: FormData
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log("Issue created successfully:", data);
//         alert("Issue reported successfully!");
//     })
//     .catch(error => {
//         console.error("Error creating issue:", error);
//         alert("Error submitting the issue. Please try again.");
//     });

// });

function cancelForm() {
    // Clear the form
    document.getElementById("upload-form").reset();
    alert("Form has been cleared.");
}

document.getElementById("report-button").addEventListener("click", function() {
    const reportWrappers = document.getElementsByClassName("report-wrapper");
    const domainWrappers = document.getElementsByClassName("domain-wrapper");

    if (reportWrappers.length > 0 && domainWrappers.length > 0) {
        reportWrappers[0].style.display = "block";  // Show the report section
        domainWrappers[0].style.display = "none";   // Hide the domain section
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
        reportWrappers[0].style.display = "none";   // Hide the report section
        domainWrappers[0].style.display = "block";  // Show the domain section
    } else {
        console.error("Elements with the specified class names not found");
    }

    this.classList.add("active");
    document.getElementById("report-button").classList.remove("active");
});