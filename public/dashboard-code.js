document.addEventListener('DOMContentLoaded', async function() {
    const response = await fetch('/api/userdata');
    const data = await response.json();
  
    document.getElementById('name').innerText = `Name: ${data.name}`;
    document.getElementById('age').innerText = `Age: ${data.age}`;
    document.getElementById('gender').innerText = `Gender: ${data.gender}`;
});