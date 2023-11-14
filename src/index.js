document.addEventListener('DOMContentLoaded', () => {
    const dogForm = document.getElementById('dog-form');
    const tableBody = document.getElementById('table-body');

    const populateForm = (dog) => {
      const { id, name, breed, sex } = dog;
      dogForm.dataset.dogId = id; 
      dogForm.name.value = name;
      dogForm.breed.value = breed;
      dogForm.sex.value = sex;
    };
  
    const renderDogsInTable = (dogs) => {
      tableBody.innerHTML = '';
      dogs.forEach(dog => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${dog.name}</td>
          <td>${dog.breed}</td>
          <td>${dog.sex}</td>
          <td><button class="edit-btn" data-dog-id="${dog.id}">Edit</button></td>
        `;
        tableBody.appendChild(row);
      });
    };

    fetch('http://localhost:3000/dogs')
      .then(response => response.json())
      .then(dogs => {
        renderDogsInTable(dogs); 
      })
  
    dogForm.addEventListener('submit', event => {
      event.preventDefault();
      const dogId = dogForm.dataset.dogId;
      const formData = new FormData(dogForm);
  
      fetch(`http://localhost:3000/dogs/${dogId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
      })
      .then(response => response.json())
      .then(updatedDog => {
        console.log('Dog updated:', updatedDog);
        return fetch('http://localhost:3000/dogs');
      })
      .then(response => response.json())
      .then(updatedDogs => {
        renderDogsInTable(updatedDogs);
      })
    });

    tableBody.addEventListener('click', event => {
      if (event.target.classList.contains('edit-btn')) {
        const dogId = event.target.dataset.dogId;
        fetch(`http://localhost:3000/dogs/${dogId}`)
          .then(response => response.json())
          .then(dog => {
            populateForm(dog);
          })
      }
    });
  });
  