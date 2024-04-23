// Make a GET request to fetch data from http://localhost:3000/get-company
fetch('http://localhost:3000/get-company')
  .then(response => {
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log(response.json());
    // Parse the JSON data in the response
    return response.json();

  })
  .then(data => {
    // Store the fetched data in a variable
    const companyData = data;
    console.log(companyData); // You can do whatever you want with the data here
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
