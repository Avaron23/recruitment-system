const API_URL = "http://127.0.0.1:8000"
const VACANCIES_API = API_URL + "/vacancies/"
const MATCHES_API = API_URL + "/matches/"
const CANDIDATES_API = API_URL + "/candidates/"
const SETTINGS_API = API_URL + "/settings/"

let vacancies = []
let candidates = []
let currentMatches = []
let currentVacancy = null
let threshold = 70  // Значение по умолчанию

window.addEventListener("DOMContentLoaded", () => {
    loadSettings()
    loadVacancies()
    loadCandidates()
    setupVacancySelector()
})

// Загрузить настройки (включая порог)
async function loadSettings() {
    try {
        const response = await fetch(SETTINGS_API)
        if (response.ok) {
            const settings = await response.json()
            threshold = settings.threshold
        }
    } catch (error) {
        console.error("Ошибка загрузки настроек:", error)
        // Используем значение по умолчанию
    }
}

// Загрузить все вакансии
async function loadVacancies() {
    try {
        const response = await fetch(VACANCIES_API)
        if (!response.ok) {
            alert("Ошибка загрузки вакансий!")
            return
        }
        vacancies = await response.json()
        populateVacancyDropdown()
    } catch (error) {
        console.error("Ошибка подключения к серверу:", error)
        alert("Нет подключения к серверу!")
    }
}

// Загрузить всех кандидатов
async function loadCandidates() {
    try {
        const response = await fetch(CANDIDATES_API)
        if (!response.ok) {
            console.error("Ошибка загрузки кандидатов!")
            return
        }
        candidates = await response.json()
    } catch (error) {
        console.error("Ошибка подключения к серверу:", error)
    }
}

// Заполнить dropdown с вакансиями
function populateVacancyDropdown() {
    const select = document.getElementById("vacancySelect")
    select.innerHTML = '<option value="">-- Выберите вакансию --</option>'
    
    vacancies.forEach(vacancy => {
        const option = document.createElement("option")
        option.value = vacancy.id
        option.textContent = `${vacancy.title} (ID: ${vacancy.id})`
        select.appendChild(option)
    })
}

// Настроить обработчик выбора вакансии
function setupVacancySelector() {
    document.getElementById("vacancySelect").addEventListener("change", (event) => {
        const vacancyId = event.target.value
        if (vacancyId) {
            loadRankedMatches(vacancyId)
        } else {
            clearResults()
        }
    })
}

// Загрузить ранжированных кандидатов по вакансии
async function loadRankedMatches(vacancyId) {
    try {
        const response = await fetch(`${MATCHES_API}${vacancyId}`)
        if (!response.ok) {
            alert("Ошибка загрузки ранжированных кандидатов!")
            clearResults()
            return
        }
        
        currentMatches = await response.json()
        currentVacancy = vacancies.find(v => v.id == vacancyId)
        
        if (currentMatches.length === 0) {
            showEmptyState("По этой вакансии нет кандидатов")
            return
        }
        
        renderRankedMatches()
    } catch (error) {
        console.error("Ошибка подключения к серверу:", error)
        alert("Нет подключения к серверу!")
    }
}

// Отрисовать таблицу ранжированных кандидатов
function renderRankedMatches() {
    const resultContainer = document.getElementById("resultContainer")
    
    if (!currentVacancy) return
    
    // Инфо о вакансии
    const vacancyInfo = `
        <div class="vacancy-info">
            <h2>📌 ${currentVacancy.title}</h2>
            <div class="vacancy-info-row">
                <span class="vacancy-info-label">Требуемый опыт:</span>
                <span class="vacancy-info-value">${currentVacancy.required_experience} лет</span>
            </div>
            <div class="vacancy-info-row">
                <span class="vacancy-info-label">Требуемое образование:</span>
                <span class="vacancy-info-value">${currentVacancy.required_education}</span>
            </div>
            <div class="vacancy-info-row">
                <span class="vacancy-info-label">Зарплата:</span>
                <span class="vacancy-info-value">₽${currentVacancy.salary_offer.toLocaleString()}</span>
            </div>
            <div class="vacancy-info-row">
                <span class="vacancy-info-label">Требуемый переезд:</span>
                <span class="vacancy-info-value">${currentVacancy.relocation_required ? '⚠️ Да' : '✅ Нет'}</span>
            </div>
            <div class="vacancy-info-row">
                <span class="vacancy-info-label">Минимальный порог ранжирования:</span>
                <span class="vacancy-info-value"><strong>${threshold}%</strong></span>
            </div>
        </div>
    `
    
    // Таблица с кандидатами
    let tableHTML = `
        <table class="ranking-table">
            <thead>
                <tr>
                    <th>Ранг</th>
                    <th>Кандидат</th>
                    <th>Сопоставление</th>
                    <th>Совпадённые навыки</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
    `
    
    currentMatches.forEach((match, index) => {
        const candidate = candidates.find(c => c.id === match.candidate_id)
        if (!candidate) return
        
        const scoreClass = getScoreClass(match.total_score)
        const rankClass = match.passed ? 'passed' : 'failed'
        const rankDisplay = match.rank ? match.rank : '✗'
        
        // Обработка навыков
        let skillsHtml = ''
        if (match.matched_skills && match.matched_skills.length > 0) {
            const displayedSkills = match.matched_skills.slice(0, 3)
            skillsHtml = displayedSkills
                .map(skill => `<span class="skill-tag matched">${skill}</span>`)
                .join('')
            
            if (match.matched_skills.length > 3) {
                skillsHtml += `<span class="skills-count">+${match.matched_skills.length - 3}</span>`
            }
        } else {
            skillsHtml = '<span style="color: #bdc3c7; font-size: 12px;">нет совпадений</span>'
        }
        
        tableHTML += `
            <tr onclick="openCandidateModal(${match.candidate_id})">
                <td><div class="rank ${rankClass}">${rankDisplay}</div></td>
                <td class="candidate-name-cell">${candidate.name}</td>
                <td><span class="score-value ${scoreClass}">${match.total_score}%</span></td>
                <td class="skills-cell">${skillsHtml}</td>
                <td class="action-buttons">
                    <button class="view-btn" onclick="event.stopPropagation(); openCandidateModal(${match.candidate_id})">👁️ Просмотр</button>
                </td>
            </tr>
        `
    })
    
    tableHTML += `
            </tbody>
        </table>
    `
    
    resultContainer.innerHTML = vacancyInfo + tableHTML
}

// Получить класс для скора
function getScoreClass(score) {
    if (score >= 70) return "high"
    if (score >= 40) return "medium"
    return "low"
}

// Открыть модальное окно с информацией о кандидате
function openCandidateModal(candidateId) {
    const candidate = candidates.find(c => c.id === candidateId)
    if (!candidate) return
    
    const match = currentMatches.find(m => m.candidate_id === candidateId)
    
    const skillsList = Array.isArray(candidate.skills) 
        ? candidate.skills.join(', ') 
        : candidate.skills
    
    const matchedSkillsHtml = match && match.matched_skills && match.matched_skills.length > 0
        ? match.matched_skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')
        : '<span style="color: #bdc3c7;">нет совпадений</span>'
    
    const scoreClass = getScoreClass(match ? match.total_score : 0)
    const passStatus = match && match.passed 
        ? `<div class="pass-status passed">✅ Прошёл пороговый балл (≥${threshold}%)</div>`
        : `<div class="pass-status failed">❌ Не прошёл пороговый балл (&lt;${threshold}%)</div>`
    
    const content = `
        <div class="modal-content">
            <h2>👤 ${candidate.name}</h2>
            
            <div class="info-row">
                <span class="info-label">ID:</span>
                <span class="info-value">${candidate.id}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">Опыт:</span>
                <span class="info-value">${candidate.experience} лет</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">Образование:</span>
                <span class="info-value">${candidate.education}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">Желаемая зарплата:</span>
                <span class="info-value">₽${candidate.desired_salary.toLocaleString()}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">Готовность к переезду:</span>
                <span class="info-value ${candidate.can_relocate ? 'yes' : 'no'}">
                    ${candidate.can_relocate ? '✅ Да' : '❌ Нет'}
                </span>
            </div>
            
            <div class="info-row">
                <span class="info-label">Навыки:</span>
                <span class="info-value">${skillsList}</span>
            </div>
            
            ${match ? `
                <div class="info-row">
                    <span class="info-label">Сопоставление с вакансией:</span>
                    <span class="info-value"><span class="score-value ${scoreClass}">${match.total_score}%</span></span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Ранг:</span>
                    <span class="info-value">${match.rank ? match.rank : 'Не прошёл отбор'}</span>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Совпадённые навыки:</span>
                    <span class="info-value"></span>
                </div>
                <div class="skills-list">${matchedSkillsHtml}</div>
                
                ${passStatus}
            ` : ''}
        </div>
    `
    
    document.getElementById("candidateModalContent").innerHTML = content
    document.getElementById("candidateModalOverlay").style.display = "flex"
}

// Закрыть модальное окно с кандидатом
function closeCandidateModal() {
    document.getElementById("candidateModalOverlay").style.display = "none"
}

// Открыть модальное окно с информацией о вакансии
function openVacancyModal() {
    if (!currentVacancy) return
    
    const requiredSkills = Array.isArray(currentVacancy.required_skills)
        ? currentVacancy.required_skills.join(', ')
        : currentVacancy.required_skills
    
    const preferredSkills = Array.isArray(currentVacancy.preferred_skills)
        ? currentVacancy.preferred_skills.join(', ')
        : currentVacancy.preferred_skills
    
    const requiredSkillsHtml = requiredSkills
        ? requiredSkills.split(',').map(s => `<span class="skill-item">${s.trim()}</span>`).join('')
        : '<span style="color: #bdc3c7;">не указаны</span>'
    
    const preferredSkillsHtml = preferredSkills
        ? preferredSkills.split(',').map(s => `<span class="skill-item">${s.trim()}</span>`).join('')
        : '<span style="color: #bdc3c7;">не указаны</span>'
    
    const content = `
        <div class="modal-content">
            <h2>💼 ${currentVacancy.title}</h2>
            
            <div class="info-row">
                <span class="info-label">ID:</span>
                <span class="info-value">${currentVacancy.id}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">Требуемый опыт:</span>
                <span class="info-value">${currentVacancy.required_experience} лет</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">Требуемое образование:</span>
                <span class="info-value">${currentVacancy.required_education}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">Зарплата:</span>
                <span class="info-value">₽${currentVacancy.salary_offer.toLocaleString()}</span>
            </div>
            
            <div class="info-row">
                <span class="info-label">Требуется переезд:</span>
                <span class="info-value ${currentVacancy.relocation_required ? 'yes' : 'no'}">
                    ${currentVacancy.relocation_required ? '⚠️ Да' : '✅ Нет'}
                </span>
            </div>
            
            <div class="info-row">
                <span class="info-label">Обязательные навыки:</span>
                <span class="info-value"></span>
            </div>
            <div class="skills-list">${requiredSkillsHtml}</div>
            
            <div class="info-row">
                <span class="info-label">Желательные навыки:</span>
                <span class="info-value"></span>
            </div>
            <div class="skills-list">${preferredSkillsHtml}</div>
        </div>
    `
    
    document.getElementById("vacancyModalContent").innerHTML = content
    document.getElementById("vacancyModalOverlay").style.display = "flex"
}

// Закрыть модальное окно с вакансией
function closeVacancyModal() {
    document.getElementById("vacancyModalOverlay").style.display = "none"
}

// Показать пустое состояние
function showEmptyState(message) {
    const resultContainer = document.getElementById("resultContainer")
    resultContainer.innerHTML = `<div class="empty-state"><p>📭 ${message}</p></div>`
}

// Очистить результаты
function clearResults() {
    document.getElementById("resultContainer").innerHTML = `
        <div class="empty-state">
            <p>📭 Выберите вакансию для просмотра ранжированных кандидатов</p>
        </div>
    `
    currentMatches = []
    currentVacancy = null
}

// Закрывать модали при клике на фон
document.addEventListener("click", (event) => {
    const candidateOverlay = document.getElementById("candidateModalOverlay")
    const vacancyOverlay = document.getElementById("vacancyModalOverlay")
    
    if (event.target === candidateOverlay) {
        closeCandidateModal()
    }
    if (event.target === vacancyOverlay) {
        closeVacancyModal()
    }
})
