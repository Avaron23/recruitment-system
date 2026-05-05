// TODO: Получить кандидатов через гет запрос, отрисовать их в таблице, обработать кнопку добавления кандидата
const API_URL = "http://127.0.0.1:8000/candidates/"


window.addEventListener("DOMContentLoaded", () => {
    loadCandidates()
    setupForm()
});


async function loadCandidates(){
    try{
        const response = await fetch(API_URL);

        if (!response.ok){
            alert("Ошибка загрузки кандидатов!")
            return
        }

        const candidates = await(response.json())
        const tbody = document.querySelector('#candidatesTable tbody')
        tbody.innerHTML = '' // очищаем таблицу

        candidates.forEach(candidate => {
            console.log(candidate)
            tbody.appendChild(createRow(candidate));
        });

    }catch (error){
        alert('Нет подключения к серверу !!!')
    }
}



// Создать строку таблицы для одного кандидата
function createRow(candidate){
    const tr = document.createElement('tr')
    tr.innerHTML = `
        <td>${candidate.id}</td>
        <td>${candidate.name}</td>
        <td>${candidate.experience}</td>
        <td>${candidate.education}</td>
        <td>${candidate.skills}</td>
        <td>${candidate.desired_salary}</td>
        <td>${candidate.can_relocate ? 'Да' : 'Нет'}</td>
        <td><button class="edit-btn">Изменить</button></td>
        <td><button class="delete-btn">Удалить</button></td>
    `

    // Удаление кандидата по кнопке
    tr.querySelector('.delete-btn').addEventListener('click', ()=>{
        deleteCandidate(candidate.id);    
    });

    // Изменение кандидата по кнопке
    tr.querySelector('.edit-btn').addEventListener('click', ()=>{
        alert("Еще не готово!")
    });

    return tr
}


async function deleteCandidate(candidateId){
    if (!confirm(`Удалить кандидата ${candidateId}?`)) return

    try{
        await fetch(`${API_URL}${candidateId}`, {method: 'DELETE'})
        loadCandidates()
        alert('Кандидат успешно удалён!')
    }catch{
        alert('Ошибка удаления кандидата!')
    }
}


// Показать форму
function add_candidate() {
    document.getElementById('formOverlay').style.display = 'flex'
}

// Скрыть форму и очистить поля
function hideForm() {
    document.getElementById('formOverlay').style.display = 'none'
    clearForm()
}

// Очистить все поля
function clearForm() {
    document.getElementById('formName').value = ''
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
            name: document.getElementById('formName').value.trim(),
            experience: parseInt(document.getElementById('formExperience').value) || 0,
            education: document.getElementById('formEducation').value.trim(),
            skills: skillsArray,
            desired_salary: parseInt(document.getElementById('formSalary').value) || 0,
            can_relocate: document.getElementById('formRelocation').checked
        }

        // Валидация
        if (!data.name) {
            alert("Имя обязательно!")
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
            loadCandidates()

        }catch(error){
            alert('Не удалось создать кандидата!')
        }
    })
}