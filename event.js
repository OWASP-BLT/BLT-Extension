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