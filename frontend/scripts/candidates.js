// TODO: Получить кандидатов через гет запрос, отрисовать их в таблице, обработать кнопку добавления кандидата
const API_URL = "http://127.0.0.1:8000/candidates/"
const MATCHES_API = "http://127.0.0.1:8000/matches/"

// Переменная для отслеживания режима редактирования
let editingCandidateId = null

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
        editCandidate(candidate);
    });

    return tr
}

function editCandidate(candidate) {
    editingCandidateId = candidate.id
    
    // Заполняем форму данными кандидата
    document.getElementById('formName').value = candidate.name
    document.getElementById('formExperience').value = candidate.experience
    document.getElementById('formEducation').value = candidate.education
    document.getElementById('formSkills').value = Array.isArray(candidate.skills) 
        ? candidate.skills.join(', ') 
        : candidate.skills
    document.getElementById('formSalary').value = candidate.desired_salary
    document.getElementById('formRelocation').checked = candidate.can_relocate
    
    // Меняем текст кнопки отправки
    document.getElementById('formSubmit').textContent = 'Сохранить изменения'
    
    // Показываем форму
    document.getElementById('formOverlay').style.display = 'flex'
}

async function deleteCandidate(candidateId){
    if (!confirm(`Удалить кандидата ${candidateId}?`)) return

    try{
        await fetch(`${API_URL}${candidateId}`, {method: 'DELETE'})
        loadCandidates()
        alert('Кандидат успешно удалён!')
    }catch(error){
        alert('Ошибка удаления кандидата!')
    }
}

// Удалить все матчи связанные с кандидатом
async function deleteMatchesByCandidateId(candidateId) {
    try {
        console.log('Начало удаления матчей для кандидата:', candidateId)
        const response = await fetch(MATCHES_API)
        if (!response.ok) {
            console.error('Ошибка при загрузке матчей:', response.status)
            return
        }
        
        const matches = await response.json()
        console.log('Все матчи:', matches)
        
        const candidateMatches = matches.filter(match => match.candidate_id === candidateId)
        console.log('Матчи кандидата к удалению:', candidateMatches)
        
        for (const match of candidateMatches) {
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
function add_candidate() {
    document.getElementById('formOverlay').style.display = 'flex'
}

// Скрыть форму и очистить поля
function hideForm() {
    document.getElementById('formOverlay').style.display = 'none'
    clearForm()
    editingCandidateId = null
    document.getElementById('formSubmit').textContent = 'Добавить'
}

// Очистить все поля
function clearForm() {
    document.getElementById('formName').value = ''
    document.getElementById('formExperience').value = ''
    document.getElementById('formEducation').value = ''
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
            const method = editingCandidateId ? 'PUT' : 'POST'
            const url = editingCandidateId ? `${API_URL}${editingCandidateId}` : API_URL
            const successMessage = editingCandidateId ? 'Кандидат успешно обновлён!' : 'Кандидат успешно добавлен!'
            const errorMessage = editingCandidateId ? 'Не удалось обновить кандидата!' : 'Не удалось создать кандидата!'
            
            // Если редактируем - удаляем старые матчи
            if (editingCandidateId) {
                await deleteMatchesByCandidateId(editingCandidateId)
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
            loadCandidates()

        }catch(error){
            alert(editingCandidateId ? 'Не удалось обновить кандидата!' : 'Не удалось создать кандидата!')
        }
    })
}