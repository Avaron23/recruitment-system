// TODO: Получить кандидатов через гет запрос, отрисовать их в таблице, обработать кнопку добавления кандидата
const API_URL = "http://127.0.0.1:8000/vacancies/"
const MATCHES_API = "http://127.0.0.1:8000/matches/"

// Переменная для отслеживания режима редактирования
let editingVacancyId = null

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
        <td>${vacancy.preferred_skills}</td>
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
        editVacancy(vacancy);
    });

    return tr
}


function editVacancy(vacancy) {
    editingVacancyId = vacancy.id
    
    // Заполняем форму данными вакансии
    document.getElementById('formTitle').value = vacancy.title
    document.getElementById('formExperience').value = vacancy.required_experience
    document.getElementById('formEducation').value = vacancy.required_education
    document.getElementById('formSkills').value = Array.isArray(vacancy.required_skills) 
        ? vacancy.required_skills.join(', ') 
        : vacancy.required_skills
    document.getElementById('formPrefSkills').value = Array.isArray(vacancy.preferred_skills) 
        ? vacancy.preferred_skills.join(', ') 
        : vacancy.preferred_skills
    document.getElementById('formSalary').value = vacancy.salary_offer
    document.getElementById('formRelocation').checked = vacancy.relocation_required
    
    // Меняем текст кнопки отправки
    document.getElementById('formSubmit').textContent = 'Сохранить изменения'
    
    // Показываем форму
    document.getElementById('formOverlay').style.display = 'flex'
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

// Удалить все матчи связанные с вакансией
async function deleteMatchesByVacancyId(vacancyId) {
    try {
        console.log('Начало удаления матчей для вакансии:', vacancyId)
        const response = await fetch(MATCHES_API)
        if (!response.ok) {
            console.error('Ошибка при загрузке матчей:', response.status)
            return
        }
        
        const matches = await response.json()
        console.log('Все матчи:', matches)
        
        const vacancyMatches = matches.filter(match => match.vacancy_id === vacancyId)
        console.log('Матчи вакансии к удалению:', vacancyMatches)
        
        for (const match of vacancyMatches) {
            console.log('Удаление матча:', match.candidate_id, match.vacancy_id)
            const deleteUrl = `${MATCHES_API}${match.candidate_id}/${match.vacancy_id}`
            console.log('URL удаления:', deleteUrl)
            const deleteResponse = await fetch(deleteUrl, { method: 'DELETE' })
            console.log('Ответ удаления матча:', deleteResponse.status)
        }
        
        console.log('Удаление матчей завершено')
    } catch (error) {
        console.error('Ошибка удаления матчей:', error)
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
    editingVacancyId = null
    document.getElementById('formSubmit').textContent = 'Добавить'
}

// Очистить все поля
function clearForm() {
    document.getElementById('formTitle').value = ''
    document.getElementById('formExperience').value = ''
    document.getElementById('formEducation').value = ''
    document.getElementById('formSkills').value = ''
    document.getElementById('formPrefSkills').value = ''
    document.getElementById('formSalary').value = ''
    document.getElementById('formRelocation').checked = false
}

// Настроить обработчики формы 
function setupForm(){
    document.getElementById('formCancel').addEventListener('click', hideForm)

    document.getElementById('formSubmit').addEventListener('click', async () => {
        // Получаем строку обязательных навыков и превращаем в массив
        const skillsRaw = document.getElementById('formSkills').value.toLowerCase().trim()
        const skillsArray = skillsRaw 
            ? skillsRaw.split(',').map(s => s.trim()).filter(s => s !== '') 
            : []

        // Получаем строку желательных навыков и превращаем в массив
        const prefSkillsRaw = document.getElementById('formPrefSkills').value.toLowerCase().trim()
        const prefSkillsArray = prefSkillsRaw 
            ? prefSkillsRaw.split(',').map(s => s.trim()).filter(s => s !== '') 
            : []


        const data = {
            title: document.getElementById('formTitle').value.trim(),
            required_experience: parseInt(document.getElementById('formExperience').value) || 0,
            required_education: document.getElementById('formEducation').value.trim(),
            required_skills: skillsArray,
            preferred_skills: prefSkillsArray,
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
            const method = editingVacancyId ? 'PUT' : 'POST'
            const url = editingVacancyId ? `${API_URL}${editingVacancyId}` : API_URL
            const successMessage = editingVacancyId ? 'Вакансия успешно обновлена!' : 'Вакансия успешно добавлена!'
            
            // Если редактируем - удаляем старые матчи
            if (editingVacancyId) {
                await deleteMatchesByVacancyId(editingVacancyId)
            }
            
            const response = await fetch(url, {
                method: method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            if(!response.ok) {
                const error = await response.json()
                alert('Ошибка: ' + (error.detail || 'неизвестная ошибка'))
                return
            }

            alert(successMessage)
            hideForm()
            loadVacancies()

        }catch(error){
            console.log(error)
            alert(editingVacancyId ? 'Не удалось обновить вакансию!' : 'Не удалось создать вакансию!')
        }
    })
}