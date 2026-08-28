const SETTINGS_API = "http://127.0.0.1:8000/settings/"

// Дефолтные значения
const DEFAULT_SETTINGS = {
    w_experience: 0.25,
    w_skills_required: 0.45,
    w_education: 0.15,
    w_salary: 0.10,
    w_relocation: 0.05,
    threshold: 70
}

window.addEventListener("DOMContentLoaded", () => {
    loadSettings()
    setupInputListeners()
})

// Загрузить настройки с бэкенда
async function loadSettings() {
    try {
        const response = await fetch(SETTINGS_API)
        if (!response.ok) {
            showMessage("Ошибка загрузки настроек", "error")
            return
        }

        const settings = await response.json()
        
        // Заполняем форму
        document.getElementById('wExperience').value = settings.w_experience
        document.getElementById('wSkillsRequired').value = settings.w_skills_required
        document.getElementById('wEducation').value = settings.w_education
        document.getElementById('wSalary').value = settings.w_salary
        document.getElementById('wRelocation').value = settings.w_relocation
        document.getElementById('threshold').value = settings.threshold

        // Обновляем значки
        updateWeightValues()
        updateThresholdValue()
        updateWeightsSum()
    } catch (error) {
        console.error("Ошибка подключения к серверу:", error)
        showMessage("Нет подключения к серверу!", "error")
    }
}

// Установить слушатели на все input'ы
function setupInputListeners() {
    const inputs = document.querySelectorAll('.weight-item input, #threshold')
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updateWeightValues()
            updateThresholdValue()
            updateWeightsSum()
        })
    })
}

// Обновить показываемые значения весов
function updateWeightValues() {
    const weights = [
        { id: 'wExperience', display: 'wExperience' },
        { id: 'wSkillsRequired', display: 'wSkillsRequired' },
        { id: 'wEducation', display: 'wEducation' },
        { id: 'wSalary', display: 'wSalary' },
        { id: 'wRelocation', display: 'wRelocation' }
    ]

    weights.forEach(weight => {
        const input = document.getElementById(weight.id)
        const span = input.parentElement.querySelector('.weight-value')
        const value = parseFloat(input.value) || 0
        span.textContent = value.toFixed(2)
    })
}

// Обновить показываемый порог
function updateThresholdValue() {
    const input = document.getElementById('threshold')
    const span = document.querySelector('.threshold-value')
    const value = parseInt(input.value) || 0
    span.textContent = value + '%'
}

// Обновить сумму весов
function updateWeightsSum() {
    const wExperience = parseFloat(document.getElementById('wExperience').value) || 0
    const wSkillsRequired = parseFloat(document.getElementById('wSkillsRequired').value) || 0
    const wEducation = parseFloat(document.getElementById('wEducation').value) || 0
    const wSalary = parseFloat(document.getElementById('wSalary').value) || 0
    const wRelocation = parseFloat(document.getElementById('wRelocation').value) || 0

    const sum = wExperience + wSkillsRequired + wEducation + wSalary + wRelocation
    const sumElement = document.getElementById('weightsSum')
    
    sumElement.textContent = sum.toFixed(2)
    
    // Изменяем цвет в зависимости от суммы
    sumElement.classList.remove('warning', 'error')
    if (Math.abs(sum - 1.0) > 0.1) {
        sumElement.classList.add('error')
    } else if (Math.abs(sum - 1.0) > 0.01) {
        sumElement.classList.add('warning')
    }
}

// Сохранить настройки
async function saveSettings() {
    const wExperience = parseFloat(document.getElementById('wExperience').value)
    const wSkillsRequired = parseFloat(document.getElementById('wSkillsRequired').value)
    const wEducation = parseFloat(document.getElementById('wEducation').value)
    const wSalary = parseFloat(document.getElementById('wSalary').value)
    const wRelocation = parseFloat(document.getElementById('wRelocation').value)
    const threshold = parseInt(document.getElementById('threshold').value)

    // Валидация
    if (isNaN(wExperience) || isNaN(wSkillsRequired)  || 
        isNaN(wEducation) || isNaN(wSalary) || isNaN(wRelocation) || isNaN(threshold)) {
        showMessage("Пожалуйста заполните все поля!", "error")
        return
    }

    const sum = wExperience + wSkillsRequired + wEducation + wSalary + wRelocation

    if (Math.abs(sum - 1.0) > 0.001) {
        showMessage(`Ошибка! Сумма весов должна быть 1.0, текущая: ${sum.toFixed(4)}`, "error")
        return
    }

    if (threshold < 0 || threshold > 100) {
        showMessage("Порог должен быть от 0 до 100", "error")
        return
    }

    // Отправляем на бэкенд
    try {
        const data = {
            w_experience: wExperience,
            w_skills_required: wSkillsRequired,
            w_education: wEducation,
            w_salary: wSalary,
            w_relocation: wRelocation,
            threshold: threshold
        }

        const response = await fetch(SETTINGS_API, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.json()
            showMessage("Ошибка: " + (error.detail || "неизвестная ошибка"), "error")
            return
        }

        showMessage("✅ Настройки успешно сохранены!", "success")
    } catch (error) {
        console.error("Ошибка подключения:", error)
        showMessage("Нет подключения к серверу!", "error")
    }
}

// Вернуть значения по умолчанию
function resetSettings() {
    if (!confirm("Вы уверены? Все значения будут переустановлены на значения по умолчанию.")) {
        return
    }

    document.getElementById('wExperience').value = DEFAULT_SETTINGS.w_experience
    document.getElementById('wSkillsRequired').value = DEFAULT_SETTINGS.w_skills_required
    document.getElementById('wEducation').value = DEFAULT_SETTINGS.w_education
    document.getElementById('wSalary').value = DEFAULT_SETTINGS.w_salary
    document.getElementById('wRelocation').value = DEFAULT_SETTINGS.w_relocation
    document.getElementById('threshold').value = DEFAULT_SETTINGS.threshold

    updateWeightValues()
    updateThresholdValue()
    updateWeightsSum()

    showMessage("ℹ️ Значения вернулись к значениям по умолчанию. Не забудьте нажать 'Сохранить'!", "info")
}

// Показать сообщение статуса
function showMessage(text, type) {
    const messageEl = document.getElementById('statusMessage')
    messageEl.textContent = text
    messageEl.className = `status-message ${type}`

    // Убрать сообщение через 5 секунд
    setTimeout(() => {
        messageEl.classList.remove('success', 'error', 'info')
    }, 5000)
}
