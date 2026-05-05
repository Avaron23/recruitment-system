// TODO: Получить кандидатов через гет запрос, отрисовать их в таблице, обработать кнопку добавления кандидата
const API_URL = "http://127.0.0.1:8000/vacancies/"


window.addEventListener("DOMContentLoaded", () => {
    loadVacancies()
    setupForm()
});


async function loadVacancies(){
    try{
        const response = await fetch(API_URL);

        if (!response.ok){
            alert("Ошибка загрузки вакансий!")
            return
        }

        const vacancies = await(response.json())
        const tbody = document.querySelector('#vacanciesTable tbody')
        tbody.innerHTML = '' // очищаем таблицу

        vacancies.forEach(vacancy => {
            console.log(vacancy)
            tbody.appendChild(createRow(vacancy));
        });

    }catch (error){
        alert('Нет подключения к серверу !!!')
    }
}



// Создать строку таблицы для одной вакансии
function createRow(vacancy){
    const tr = document.createElement('tr')
    tr.innerHTML = `
        <td>${vacancy.id}</td>
        <td>${vacancy.title}</td>
        <td>${vacancy.required_experience}</td>
        <td>${vacancy.required_education}</td>
        <td>${vacancy.required_skills}</td>
        <td>${vacancy.salary_offer}</td>
        <td>${vacancy.relocation_required ? 'Да' : 'Нет'}</td>
        <td><button class="edit-btn">Изменить</button></td>
        <td><button class="delete-btn">Удалить</button></td>
    `

    // Удаление вакансии по кнопке
    tr.querySelector('.delete-btn').addEventListener('click', ()=>{
        deleteVacancy(vacancy.id);    
    });

    // Изменение вакансии по кнопке
    tr.querySelector('.edit-btn').addEventListener('click', ()=>{
        alert("Еще не готово!")
    });

    return tr
}


async function deleteVacancy(vacancyId){
    if (!confirm(`Удалить вакансию ${vacancyId}?`)) return

    try{
        await fetch(`${API_URL}${vacancyId}`, {method: 'DELETE'})
        loadVacancies()
        alert('Вакансия успешна удалена!')
    }catch(error){
        alert('Ошибка удаления вакансии!')
    }
}


// Показать форму
function add_vacancy() {
    document.getElementById('formOverlay').style.display = 'flex'
}

// Скрыть форму и очистить поля
function hideForm() {
    document.getElementById('formOverlay').style.display = 'none'
    clearForm()
}

// Очистить все поля
function clearForm() {
    document.getElementById('formTitle').value = ''
    document.getElementById('formExperience').value = ''
    document.getElementById('formSkills').value = ''
    document.getElementById('formSalary').value = ''
    document.getElementById('formRelocation').checked = false
}

// Настроить обработчики формы 
function setupForm(){
    document.getElementById('formCancel').addEventListener('click', hideForm)

    document.getElementById('formSubmit').addEventListener('click', async () => {
        // Получаем строку навыков и превращаем в массив
        const skillsRaw = document.getElementById('formSkills').value.toLowerCase().trim()
        const skillsArray = skillsRaw 
            ? skillsRaw.split(',').map(s => s.trim()).filter(s => s !== '') 
            : []


        const data = {
            title: document.getElementById('formTitle').value.trim(),
            required_experience: parseInt(document.getElementById('formExperience').value) || 0,
            required_education: document.getElementById('formEducation').value.trim(),
            required_skills: skillsArray,
            salary_offer: parseInt(document.getElementById('formSalary').value) || 0,
            relocation_required: document.getElementById('formRelocation').checked
        }

        // Валидация
        if (!data.title) {
            alert("Название обязательно!")
            return
        }


        // Отправляем запрос
        try{
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            if(!response.ok) {
                const error = await response.json()
                alert('Ошибка: ' + (error.detail || 'неизвестная ошибка'))
                return
            }

            hideForm()
            loadVacancies()

        }catch(error){
            console.log(error)
            alert('Не удалось создать вакансию!')
        }
    })
}