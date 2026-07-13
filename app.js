// app.js

// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ============================================
var allTx = [];
var allData = null;
var chartCat = null;
var chartBank = null;
var chartTrend = null;
var chartMonthly = null;
var chartHeatmap = null;
var builderChart = null;
var chartWeeklyTrend = null;
var chartCategoryCompare = null;
var chartCumulative = null;

var currentUser = null;
var txnLimit = 50;
var txnOffset = 0;
var txnAll = [];

var categoryListsExpanded = { income: false, expense: false };
var allCategoriesExpanded = false;
var sessionTimer = null;
var lastActivity = Date.now();

var dashboardChartsVisible = true;
var yearlyVisible = true;
var editModeActive = false;

var sortableInstances = [];
var originalLayout = {};
var savedLayout = {};

var compactMode = false;

var emojis = ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😋','😎','😍','🥰','😘','😗','😙','😚','☺️','🙂','🤗','🤩','🤔','🤨','😐','😑','😶','🙄','😏','😣','😥','😮','🤐','😯','😪','😫','😴','😌','😛','😜','😝','🤤','😒','😓','😔','😕','🙃','🤑','😲','☹️','🙁','😖','😞','😟','😤','😢','😭','😦','😧','😨','😩','🤯','😬','😰','😱','🥵','🥶','😳','🤪','😵','😡','😠','🤬','🍎','🍕','🍔','🍟','🌭','🍿','🧇','🥞','🧁','🍩','🍪','☕','🥤','🧃','🍷','🍺','🍻','🥂','🍾','🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🚚','🚛','🚜','🏍️','🛵','🚲','🛴','🛹','✈️','🛩️','🛫','🛬','🚁','🚟','🚠','🚡','🚀','🛸','🎮','🎲','🎯','🎳','🎪','🎨','🎭','🎤','🎧','🎼','🎹','🥁','🎸','🎺','🎻','🏀','🏈','⚽','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🏓','🏸','🏒','🏑','🥍','🏏','👕','👖','👗','👘','👙','👚','👛','👜','👝','🎒','👞','👟','🥾','🥿','👠','👡','👢','💎','📿','💄','💍','💅','💪','🦷','🦴','❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎','🆑','🅾️','🆘','❌','⭕','🛑','⛔','📛','🚫','💯','💢','♨️','🚷','🚯','🚳','🚭','🔞','📵','🚱','🔱','⚠️','🚸','⛽','🛢️','♿','🛗','🔄','🔃','🔄','🔙','🔚','🔛','🔜','🔝','🛐','🕋','🕌','🛕','🛤️','🛣️','🗾','🗺️','🌍','🌎','🌏','🌐','🗿','🪦','🪔','🪬','🪭','🪩','🪟','🪑','🪞','🪝','🪢','🧶','🧵','🪡','🪣','🧹','🧺','🧻','🧼','🧽','🪥','🧴','🪒','🧷','🧸','🪀','🪁','🧿','🪆','🧩','🪅','🧯','🪄','🪩','🧬','🧫','🧪','🔬','🔭','📡','💉','🩸','🩹','🩺','🪨','🧱'];

// Ссылка на ваше веб-приложение (УЖЕ ВСТАВЛЕНА ВАША НОВАЯ)
var APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxdUScYmBuDGo3UrBgQfsBf-TNR2gGRdt1JGldiqPz-j3Ogm8R-dbSghsQwWvUNrKG5GQ/exec";

// ============================================
// УТИЛИТЫ
// ============================================
function showToast(m, t) {
  var toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(26,26,62,0.95);border:1px solid var(--border-color);border-radius:12px;padding:10px 20px;color:var(--text-primary);font-size:13px;z-index:9999;box-shadow:0 8px 30px rgba(0,0,0,0.5);animation:slideUp 0.3s ease forwards;max-width:90%;text-align:center;';
  toast.textContent = t ? t + ': ' + m : m;
  document.body.appendChild(toast);
  setTimeout(function () {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 2500);
}

function resetSessionTimer() {
  lastActivity = Date.now();
  if (sessionTimer) clearTimeout(sessionTimer);
  sessionTimer = setTimeout(function () {
    if (Date.now() - lastActivity >= 15 * 60 * 1000) {
      logout();
      showToast('Сессия истекла. Войдите снова.', 'Выход');
    }
  }, 15 * 60 * 1000);
}

document.addEventListener('click', resetSessionTimer);
document.addEventListener('keydown', resetSessionTimer);
document.addEventListener('scroll', resetSessionTimer);

// ============================================
// ТЕМА И РЕЖИМЫ
// ============================================
function toggleTheme() {
  var body = document.body,
    btn = document.getElementById('themeToggleBtn');
  body.classList.toggle('light-mode');
  var isLight = body.classList.contains('light-mode');
  btn.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('luminous_theme', isLight ? 'light' : 'dark');
}

function loadTheme() {
  var theme = localStorage.getItem('luminous_theme');
  if (theme === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('themeToggleBtn').textContent = '☀️';
  } else {
    document.body.classList.remove('light-mode');
    document.getElementById('themeToggleBtn').textContent = '🌙';
  }
}

function toggleMobileMode() {
  var body = document.body,
    btn = document.getElementById('toggleMobileBtn');
  body.classList.toggle('mobile-mode');
  var isMobile = body.classList.contains('mobile-mode');
  btn.textContent = isMobile ? '💻 Десктоп' : '📱 Мобильная';
  localStorage.setItem('luminous_mobile', isMobile ? 'mobile' : 'desktop');
  showToast(isMobile ? 'Включена мобильная версия' : 'Включена десктопная версия', 'Режим');
  if (allData) {
    updateCharts(allData);
    updateDashboardYearly(allData);
    updateExtraCharts(allData);
  }
}

function setQuickFilter(preset) {
  var periodSelect = document.getElementById('unifiedPeriod'),
    from = document.getElementById('unifiedDateFrom'),
    to = document.getElementById('unifiedDateTo'),
    customRange = document.getElementById('unifiedCustomRange');
  if (preset === 'today') {
    var today = new Date().toISOString().split('T')[0];
    from.value = today;
    to.value = today;
    customRange.style.display = 'flex';
    periodSelect.value = 'custom';
  } else if (preset === 'week') {
    var now = new Date(),
      day = now.getDay(),
      diff = now.getDate() - day + (day === 0 ? -6 : 1),
      monday = new Date(now.setDate(diff)),
      sunday = new Date(now.setDate(diff + 6));
    from.value = monday.toISOString().split('T')[0];
    to.value = sunday.toISOString().split('T')[0];
    customRange.style.display = 'flex';
    periodSelect.value = 'custom';
  } else if (preset === 'month') {
    periodSelect.value = 'currentMonth';
    customRange.style.display = 'none';
  } else if (preset === 'year') {
    periodSelect.value = 'currentYear';
    customRange.style.display = 'none';
  } else {
    periodSelect.value = 'all';
    customRange.style.display = 'none';
  }
  refreshData();
}

function toggleCompactMode() {
  compactMode = !compactMode;
  var btn = document.getElementById('compactToggleBtn');
  btn.textContent = compactMode ? '📐 Расширенный' : '📐 Компактный';
  document.body.classList.toggle('compact-mode', compactMode);
  localStorage.setItem('luminous_compact', compactMode ? 'true' : 'false');
  if (compactMode) {
    document.querySelectorAll('.kpi-card').forEach(el => el.style.padding = '6px 8px');
    document.querySelectorAll('.kpi-card .value').forEach(el => el.style.fontSize = '14px');
    document.querySelectorAll('.chart-container').forEach(el => el.style.padding = '8px');
    document.querySelectorAll('.widget').forEach(el => el.style.padding = '6px 8px');
    document.querySelectorAll('.filters-bar').forEach(el => el.style.padding = '6px 8px');
    document.querySelectorAll('.filters-bar select,.filters-bar input').forEach(el => el.style.fontSize = '11px');
  } else {
    document.querySelectorAll('.kpi-card').forEach(el => el.style.padding = '');
    document.querySelectorAll('.kpi-card .value').forEach(el => el.style.fontSize = '');
    document.querySelectorAll('.chart-container').forEach(el => el.style.padding = '');
    document.querySelectorAll('.widget').forEach(el => el.style.padding = '');
    document.querySelectorAll('.filters-bar').forEach(el => el.style.padding = '');
    document.querySelectorAll('.filters-bar select,.filters-bar input').forEach(el => el.style.fontSize = '');
  }
  if (allData) {
    updateCharts(allData);
    updateDashboardYearly(allData);
    updateExtraCharts(allData);
  }
}

// ============================================
// АВТОРИЗАЦИЯ
// ============================================
function showRegister() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('regError').style.display = 'none';
  document.getElementById('regSuccess').style.display = 'none';
}

function showLogin() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('regError').style.display = 'none';
  document.getElementById('regSuccess').style.display = 'none';
}

function register() {
  var login = document.getElementById('regLogin').value.trim();
  var password = document.getElementById('regPassword').value;
  var phone = document.getElementById('regPhone').value.trim();
  var errorEl = document.getElementById('regError'),
    successEl = document.getElementById('regSuccess');
  errorEl.style.display = 'none';
  successEl.style.display = 'none';
  if (!login) {
    errorEl.textContent = 'Введите логин';
    errorEl.style.display = 'block';
    return;
  }
  if (!/^[a-zA-Z0-9]+$/.test(login)) {
    errorEl.textContent = 'Логин должен содержать только латинские буквы и цифры';
    errorEl.style.display = 'block';
    return;
  }
  if (!password || password.length < 4) {
    errorEl.textContent = 'Пароль должен быть минимум 4 символа';
    errorEl.style.display = 'block';
    return;
  }
  if (!phone || phone.length !== 10) {
    errorEl.textContent = 'Телефон должен содержать ровно 10 цифр';
    errorEl.style.display = 'block';
    return;
  }
  google.script.run.withSuccessHandler(function (result) {
    if (result.success) {
      successEl.textContent = '✅ Регистрация успешна! Теперь войдите.';
      successEl.style.display = 'block';
      setTimeout(function () {
        showLogin();
        document.getElementById('loginInput').value = login;
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
      }, 1500);
    } else {
      errorEl.textContent = '❌ ' + (result.error || 'Ошибка регистрации');
      errorEl.style.display = 'block';
    }
  }).withFailureHandler(function (err) {
    errorEl.textContent = 'Ошибка соединения: ' + err;
    errorEl.style.display = 'block';
  }).registerUser(login, password, phone);
}

function showLoginError(message) {
  var errorEl = document.getElementById('loginError');
  errorEl.textContent = message || '❌ Неверный логин или пароль';
  errorEl.style.display = 'block';
  errorEl.classList.add('show');
  setTimeout(function () {
    errorEl.classList.remove('show');
  }, 400);
}

function checkLogin() {
  var login = document.getElementById('loginInput').value.trim();
  var password = document.getElementById('passwordInput').value;
  var errorEl = document.getElementById('loginError');
  errorEl.style.display = 'none';
  errorEl.classList.remove('show');
  if (!login || !password) {
    showLoginError('Введите логин и пароль');
    return;
  }
  google.script.run.withSuccessHandler(function (r) {
    if (r && r.success) {
      currentUser = r.user;
      localStorage.setItem('luminous_session', JSON.stringify({ user: currentUser, timestamp: Date.now() }));
      document.getElementById('loginScreen').style.opacity = '0';
      setTimeout(function () {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('loginScreen').style.opacity = '1';
        document.getElementById('appContainer').style.display = 'flex';
        document.getElementById('appContainer').style.animation = 'fadeIn 0.5s ease';
        updateUserDisplay();
        refreshData();
        resetSessionTimer();
        if (currentUser.role === 'Администратор') {
          document.getElementById('adminPanel').style.display = 'flex';
        } else {
          document.getElementById('adminPanel').style.display = 'none';
        }
      }, 500);
    } else {
      showLoginError(r.error || 'Неверный логин или пароль');
      document.getElementById('passwordInput').value = '';
      document.getElementById('passwordInput').focus();
    }
  }).withFailureHandler(function (err) {
    showLoginError('Ошибка соединения: ' + err);
  }).loginUser(login, password);
}

function updateUserDisplay() {
  var fullNameEl = document.getElementById('userFullName'),
    phoneEl = document.getElementById('userPhone'),
    badgeEl = document.getElementById('userRoleDisplay');
  if (currentUser) {
    google.script.run.withSuccessHandler(function (profile) {
      if (profile && profile.surname && profile.name) {
        var fullName = profile.surname + ' ' + profile.name;
        if (profile.patronymic) fullName += ' ' + profile.patronymic;
        fullNameEl.textContent = fullName;
        phoneEl.textContent = profile.phone || '+7';
        localStorage.setItem('luminous_user_profile', JSON.stringify(profile));
      } else {
        var saved = localStorage.getItem('luminous_user_profile');
        if (saved) {
          try {
            var p = JSON.parse(saved);
            if (p.surname && p.name) {
              var fullName = p.surname + ' ' + p.name;
              if (p.patronymic) fullName += ' ' + p.patronymic;
              fullNameEl.textContent = fullName;
              phoneEl.textContent = p.phone || '+7';
            } else {
              fullNameEl.textContent = currentUser.login;
              phoneEl.textContent = '+7';
            }
          } catch (e) {
            fullNameEl.textContent = currentUser.login;
            phoneEl.textContent = '+7';
          }
        } else {
          fullNameEl.textContent = currentUser.login;
          phoneEl.textContent = '+7';
        }
      }
      if (currentUser.role && currentUser.role !== 'Пользователь') {
        badgeEl.style.display = 'inline-block';
        badgeEl.textContent = currentUser.role;
        badgeEl.className = 'role-badge ' + currentUser.role.toLowerCase();
      } else {
        badgeEl.style.display = 'none';
      }
    }).withFailureHandler(function () {
      var saved = localStorage.getItem('luminous_user_profile');
      if (saved) {
        try {
          var p = JSON.parse(saved);
          if (p.surname && p.name) {
            var fullName = p.surname + ' ' + p.name;
            if (p.patronymic) fullName += ' ' + p.patronymic;
            fullNameEl.textContent = fullName;
            phoneEl.textContent = p.phone || '+7';
          } else {
            fullNameEl.textContent = currentUser.login;
            phoneEl.textContent = '+7';
          }
        } catch (e) {
          fullNameEl.textContent = currentUser.login;
          phoneEl.textContent = '+7';
        }
      } else {
        fullNameEl.textContent = currentUser.login;
        phoneEl.textContent = '+7';
      }
      if (currentUser.role && currentUser.role !== 'Пользователь') {
        badgeEl.style.display = 'inline-block';
        badgeEl.textContent = currentUser.role;
        badgeEl.className = 'role-badge ' + currentUser.role.toLowerCase();
      } else {
        badgeEl.style.display = 'none';
      }
    }).getProfile(currentUser.login);
  } else {
    fullNameEl.textContent = 'Пользователь';
    phoneEl.textContent = '+7';
    badgeEl.style.display = 'none';
  }
}

// ============================================
// ВОССТАНОВЛЕНИЕ ПАРОЛЯ
// ============================================
function showForgotPassword() {
  document.getElementById('forgotModal').classList.add('active');
  document.getElementById('forgotPhone').value = '';
  document.getElementById('forgotUserData').style.display = 'none';
  document.getElementById('forgotNewPasswordSection').style.display = 'none';
  document.getElementById('forgotResult').innerHTML = '';
  document.getElementById('forgotError').style.display = 'none';
  document.getElementById('forgotSuccess').style.display = 'none';
  document.getElementById('forgotPhone').focus();
}

function closeForgotModal() {
  document.getElementById('forgotModal').classList.remove('active');
}

function checkForgotPhone() {
  var phone = document.getElementById('forgotPhone').value.trim();
  var resultDiv = document.getElementById('forgotResult'),
    userDataDiv = document.getElementById('forgotUserData'),
    newPassSection = document.getElementById('forgotNewPasswordSection'),
    errorEl = document.getElementById('forgotError'),
    successEl = document.getElementById('forgotSuccess');
  errorEl.style.display = 'none';
  successEl.style.display = 'none';
  userDataDiv.style.display = 'none';
  newPassSection.style.display = 'none';
  resultDiv.innerHTML = 'Поиск...';
  if (!phone || phone.length !== 10) {
    resultDiv.innerHTML = '❌ Введите ровно 10 цифр телефона';
    return;
  }
  google.script.run.withSuccessHandler(function (user) {
    if (user) {
      resultDiv.innerHTML = '✅ Пользователь найден!';
      userDataDiv.innerHTML = '👤 Логин: <strong>' + user.login + '</strong><br>🔒 Пароль: <strong>' + user.password + '</strong>';
      userDataDiv.style.display = 'block';
      newPassSection.style.display = 'block';
      document.getElementById('forgotNewPassword').value = '';
      document.getElementById('forgotNewPassword').focus();
      window.forgotLogin = user.login;
    } else {
      resultDiv.innerHTML = '❌ Пользователь с таким номером телефона не найден';
    }
  }).withFailureHandler(function (err) {
    resultDiv.innerHTML = 'Ошибка: ' + err;
  }).getUserByPhoneOnly(phone);
}

function resetForgotPassword() {
  var newPassword = document.getElementById('forgotNewPassword').value;
  var errorEl = document.getElementById('forgotError'),
    successEl = document.getElementById('forgotSuccess');
  errorEl.style.display = 'none';
  successEl.style.display = 'none';
  if (!newPassword || newPassword.length < 4) {
    errorEl.textContent = 'Пароль должен быть минимум 4 символа';
    errorEl.style.display = 'block';
    return;
  }
  var login = window.forgotLogin;
  if (!login) {
    errorEl.textContent = 'Ошибка: пользователь не найден';
    errorEl.style.display = 'block';
    return;
  }
  google.script.run.withSuccessHandler(function (result) {
    if (result) {
      successEl.textContent = '✅ Пароль успешно изменён! Теперь войдите с новым паролем.';
      successEl.style.display = 'block';
      setTimeout(function () {
        closeForgotModal();
        document.getElementById('loginInput').value = login;
        document.getElementById('passwordInput').focus();
      }, 1500);
    } else {
      errorEl.textContent = '❌ Ошибка при смене пароля';
      errorEl.style.display = 'block';
    }
  }).withFailureHandler(function (err) {
    errorEl.textContent = 'Ошибка: ' + err;
    errorEl.style.display = 'block';
  }).updateUserPassword(login, newPassword);
}

// ============================================
// EMOJI PICKER
// ============================================
function toggleEmojiPicker(inputId) {
  var pickerId = inputId === 'newCatEmoji' ? 'emojiPickerNew' : 'emojiPickerEdit';
  var picker = document.getElementById(pickerId);
  if (picker.style.display === 'grid') {
    picker.style.display = 'none';
    return;
  }
  picker.innerHTML = '';
  emojis.forEach(function (emoji) {
    var span = document.createElement('span');
    span.textContent = emoji;
    span.onclick = function () {
      document.getElementById(inputId).value = emoji;
      picker.style.display = 'none';
    };
    picker.appendChild(span);
  });
  picker.style.display = 'grid';
  document.addEventListener('click', function closePicker(e) {
    var container = document.querySelector('.emoji-picker-container');
    if (container && !container.contains(e.target)) {
      picker.style.display = 'none';
      document.removeEventListener('click', closePicker);
    }
  });
}

// ============================================
// ДИЗАЙНЕР ОКОН
// ============================================
function showModalDesigner() {
  document.getElementById('modalDesigner').classList.add('active');
  loadDesignerSettings();
}

function closeModalDesigner() {
  document.getElementById('modalDesigner').classList.remove('active');
}

function loadDesignerSettings() {
  var windowSelect = document.getElementById('designerWindowSelect');
  var selected = windowSelect.value;
  google.script.run.withSuccessHandler(function (settings) {
    var s = settings[selected] || settings['Добавить транзакцию'];
    if (s) {
      document.getElementById('designerName').value = selected;
      document.getElementById('designerWidth').value = s.width || 460;
      document.getElementById('designerHeight').value = s.height || 600;
      document.getElementById('designerOrder').value = s.fieldOrder || '';
      updateDesignerPreview();
    }
  }).getModalSettings();
  windowSelect.onchange = function () {
    loadDesignerSettings();
  };
}

function updateDesignerPreview() {
  var width = document.getElementById('designerWidth').value;
  var height = document.getElementById('designerHeight').value;
  var name = document.getElementById('designerName').value;
  var preview = document.getElementById('designerPreview');
  preview.style.width = width + 'px';
  preview.style.height = height + 'px';
  var h4 = preview.querySelector('h4');
  if (h4) h4.textContent = '➕ ' + name;
}

function applyDesignerSettings() {
  updateDesignerPreview();
  showToast('Настройки применены к предпросмотру', 'Успешно');
}

function saveDesignerSettings() {
  var name = document.getElementById('designerName').value;
  var settings = {};
  settings[name] = {
    width: parseInt(document.getElementById('designerWidth').value) || 460,
    height: parseInt(document.getElementById('designerHeight').value) || 600,
    fieldOrder: document.getElementById('designerOrder').value || '',
    fieldWidths: ''
  };
  google.script.run.withSuccessHandler(function (result) {
    if (result) {
      showToast('✅ Настройки сохранены!', 'Успешно');
      closeModalDesigner();
    } else {
      showToast('❌ Ошибка сохранения', 'Ошибка');
    }
  }).updateModalSettings(settings);
}

function initDesignerResize() {
  var preview = document.getElementById('designerPreview');
  if (preview) {
    preview.addEventListener('mousedown', function (e) {
      var rect = preview.getBoundingClientRect();
      var isCorner = (e.clientX > rect.right - 20 && e.clientY > rect.bottom - 20);
      if (isCorner) {
        var startX = e.clientX,
          startY = e.clientY;
        var startWidth = preview.offsetWidth,
          startHeight = preview.offsetHeight;

        function onMove(ev) {
          var newWidth = Math.max(300, startWidth + (ev.clientX - startX));
          var newHeight = Math.max(200, startHeight + (ev.clientY - startY));
          preview.style.width = newWidth + 'px';
          preview.style.height = newHeight + 'px';
          document.getElementById('designerWidth').value = Math.round(newWidth);
          document.getElementById('designerHeight').value = Math.round(newHeight);
        }

        function onUp() {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      }
    });
  }
}

// ============================================
// РЕДАКТИРОВАНИЕ ДАШБОРДА
// ============================================
function toggleEditMode() {
  editModeActive = !editModeActive;
  var btn = document.getElementById('toggleEditBtn');
  if (editModeActive) {
    btn.textContent = '💾 Сохранить и выйти';
    enableEditMode();
  } else {
    btn.textContent = '✏️ Редактировать дашборд';
    disableEditMode();
    saveLayout();
  }
}

function enableEditMode() {
  originalLayout = getCurrentLayout();
  var containers = document.querySelectorAll('.section .widgets-grid,.section .charts-grid,.section .category-grid,.section .yearly-block,.section .compare-block,.section .kpi-grid,.section .builder-section');
  containers.forEach(function (container) {
    container.parentElement.classList.add('edit-mode');
    var items = container.querySelectorAll('.widget,.chart-container,.yearly-block,.compare-block,.kpi-card,.builder-section');
    items.forEach(function (item) {
      if (!item.querySelector('.drag-handle')) {
        var handle = document.createElement('div');
        handle.className = 'drag-handle';
        handle.textContent = '⠿ Перетащить';
        item.style.position = 'relative';
        item.prepend(handle);
      }
      if (!item.querySelector('.resize-handle')) {
        var resize = document.createElement('div');
        resize.className = 'resize-handle';
        item.appendChild(resize);
        resize.addEventListener('mousedown', function (e) {
          e.stopPropagation();
          var el = this.parentElement;
          var startX = e.clientX,
            startY = e.clientY;
          var startWidth = el.offsetWidth,
            startHeight = el.offsetHeight;

          function onMove(ev) {
            var newWidth = Math.max(200, startWidth + (ev.clientX - startX));
            var newHeight = Math.max(150, startHeight + (ev.clientY - startY));
            el.style.width = newWidth + 'px';
            el.style.height = newHeight + 'px';
          }

          function onUp() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
          }
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        });
      }
    });
    var sortable = new Sortable(container, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'sortable-ghost',
      onEnd: function () {
        saveLayout();
      }
    });
    sortableInstances.push(sortable);
  });
  showToast('Режим редактирования активирован. Перетаскивайте элементы за ручку.', 'Информация');
}

function disableEditMode() {
  document.querySelectorAll('.edit-mode').forEach(function (el) {
    el.classList.remove('edit-mode');
  });
  document.querySelectorAll('.drag-handle,.resize-handle').forEach(function (el) {
    el.remove();
  });
  sortableInstances.forEach(function (s) {
    s.destroy();
  });
  sortableInstances = [];
}

function getCurrentLayout() {
  var layout = {};
  var widgets = document.querySelectorAll('#sec-dashboard .widget,#sec-dashboard .chart-container,#sec-dashboard .yearly-block,#sec-dashboard .compare-block,#sec-dashboard .kpi-card,#sec-dashboard .builder-section');
  widgets.forEach(function (el, index) {
    var id = el.id || 'el_' + index;
    layout[id] = {
      order: index,
      width: el.offsetWidth || 0,
      height: el.offsetHeight || 0,
      x: el.offsetLeft || 0,
      y: el.offsetTop || 0
    };
  });
  return layout;
}

function saveLayout() {
  var layout = getCurrentLayout();
  google.script.run.withSuccessHandler(function (result) {
    if (result) {
      savedLayout = layout;
      showToast('✅ Расположение сохранено!', 'Успешно');
    }
  }).saveDashboardLayout(layout);
}

function loadSavedLayout() {
  google.script.run.withSuccessHandler(function (layout) {
    if (Object.keys(layout).length > 0) {
      savedLayout = layout;
      for (var id in layout) {
        var el = document.getElementById(id);
        if (el) {
          if (layout[id].width) el.style.width = layout[id].width + 'px';
          if (layout[id].height) el.style.height = layout[id].height + 'px';
        }
      }
    }
  }).getDashboardLayout();
}

function undoLayout() {
  if (Object.keys(originalLayout).length === 0) {
    showToast('Нет сохранённого состояния для отмены', 'Информация');
    return;
  }
  for (var id in originalLayout) {
    var el = document.getElementById(id);
    if (el) {
      if (originalLayout[id].width) el.style.width = originalLayout[id].width + 'px';
      if (originalLayout[id].height) el.style.height = originalLayout[id].height + 'px';
    }
  }
  showToast('✅ Изменения отменены', 'Успешно');
}

// ============================================
// НАВИГАЦИЯ
// ============================================
function switchTab(id) {
  document.querySelectorAll('.nav-item').forEach(function (b) {
    b.classList.remove('active');
  });
  var navItem = document.querySelector('.nav-item[onclick*="' + id + '"]');
  if (navItem) navItem.classList.add('active');
  document.querySelectorAll('.section').forEach(function (s) {
    s.classList.remove('active');
  });
  var section = document.getElementById('sec-' + id);
  if (section) section.classList.add('active');
  refreshData();
}

function toggleDashboardCharts() {
  var charts = document.querySelectorAll('#dashboardCharts .chart-container');
  var label = document.getElementById('chartToggleLabel');
  charts.forEach(function (c) {
    c.style.display = dashboardChartsVisible ? 'none' : 'block';
  });
  dashboardChartsVisible = !dashboardChartsVisible;
  label.textContent = dashboardChartsVisible ? 'Скрыть' : 'Показать';
}

function toggleYearlyBlock() {
  var container = document.getElementById('dashboardYearlyAnalytics');
  var btn = document.getElementById('toggleYearlyBtn');
  if (container.style.display === 'none') {
    container.style.display = 'block';
    btn.textContent = '📊 Скрыть годовую аналитику';
  } else {
    container.style.display = 'none';
    btn.textContent = '📊 Показать годовую аналитику';
  }
}

// ============================================
// ФИЛЬТРЫ
// ============================================
function initFilters() {
  document.getElementById('unifiedPeriod').addEventListener('change', function () {
    document.getElementById('unifiedCustomRange').style.display = this.value === 'custom' ? 'flex' : 'none';
    refreshData();
  });
  document.getElementById('unifiedCategory').addEventListener('change', refreshData);
  document.getElementById('unifiedBank').addEventListener('change', refreshData);
  document.getElementById('unifiedType').addEventListener('change', refreshData);
  document.getElementById('unifiedSearch').addEventListener('input', refreshData);
  document.getElementById('unifiedDateFrom').addEventListener('change', refreshData);
  document.getElementById('unifiedDateTo').addEventListener('change', refreshData);

  document.getElementById('unifiedPeriodTxn').addEventListener('change', function () {
    document.getElementById('unifiedCustomRangeTxn').style.display = this.value === 'custom' ? 'flex' : 'none';
    refreshData();
  });
  document.getElementById('unifiedCategoryTxn').addEventListener('change', refreshData);
  document.getElementById('unifiedBankTxn').addEventListener('change', refreshData);
  document.getElementById('unifiedTypeTxn').addEventListener('change', refreshData);
  document.getElementById('unifiedSearchTxn').addEventListener('input', refreshData);
  document.getElementById('unifiedDateFromTxn').addEventListener('change', refreshData);
  document.getElementById('unifiedDateToTxn').addEventListener('change', refreshData);

  document.getElementById('unifiedPeriodCat').addEventListener('change', function () {
    document.getElementById('unifiedCustomRangeCat').style.display = this.value === 'custom' ? 'flex' : 'none';
    refreshData();
  });
  document.getElementById('unifiedTypeCat').addEventListener('change', refreshData);
  document.getElementById('unifiedSearchCat').addEventListener('input', refreshData);
  document.getElementById('unifiedDateFromCat').addEventListener('change', refreshData);
  document.getElementById('unifiedDateToCat').addEventListener('change', refreshData);

  document.getElementById('yearlyFilter').addEventListener('change', refreshData);

  document.getElementById('comparePeriod1').addEventListener('change', function () {
    var custom = this.value === 'custom';
    document.getElementById('compareDateFrom1').style.display = custom ? 'inline-block' : 'none';
    document.getElementById('compareDateTo1').style.display = custom ? 'inline-block' : 'none';
  });
  document.getElementById('comparePeriod2').addEventListener('change', function () {
    var custom = this.value === 'custom';
    document.getElementById('compareDateFrom2').style.display = custom ? 'inline-block' : 'none';
    document.getElementById('compareDateTo2').style.display = custom ? 'inline-block' : 'none';
  });
}

function resetUnifiedFilters() {
  document.getElementById('unifiedPeriod').value = 'currentYear';
  document.getElementById('unifiedCustomRange').style.display = 'none';
  document.getElementById('unifiedCategory').value = 'all';
  document.getElementById('unifiedBank').value = 'all';
  document.getElementById('unifiedType').value = 'all';
  document.getElementById('unifiedSearch').value = '';
  document.getElementById('unifiedDateFrom').value = '';
  document.getElementById('unifiedDateTo').value = '';
  refreshData();
}

function resetUnifiedFiltersTxn() {
  document.getElementById('unifiedPeriodTxn').value = 'currentYear';
  document.getElementById('unifiedCustomRangeTxn').style.display = 'none';
  document.getElementById('unifiedCategoryTxn').value = 'all';
  document.getElementById('unifiedBankTxn').value = 'all';
  document.getElementById('unifiedTypeTxn').value = 'all';
  document.getElementById('unifiedSearchTxn').value = '';
  document.getElementById('unifiedDateFromTxn').value = '';
  document.getElementById('unifiedDateToTxn').value = '';
  refreshData();
}

function resetUnifiedFiltersCat() {
  document.getElementById('unifiedPeriodCat').value = 'currentYear';
  document.getElementById('unifiedCustomRangeCat').style.display = 'none';
  document.getElementById('unifiedTypeCat').value = 'all';
  document.getElementById('unifiedSearchCat').value = '';
  document.getElementById('unifiedDateFromCat').value = '';
  document.getElementById('unifiedDateToCat').value = '';
  refreshData();
}

// ============================================
// ЗАГРУЗКА ДАННЫХ (FIREBASE + SHEETS)
// ============================================
function refreshData() {
  loadData();
}

function showLoading() {
  document.getElementById('transactionList').innerHTML = '<div class="loading-dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
  document.getElementById('dashboardYearlyAnalytics').innerHTML = '<div class="loading-dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
}

async function loadData() {
  showLoading();
  var activeFilters = { period: 'all', category: 'all', bank: 'all', type: 'all', search: '', dateFrom: '', dateTo: '' };
  var activeSection = document.querySelector('.section.active');
  if (activeSection) {
    var id = activeSection.id.replace('sec-', '');
    if (id === 'dashboard') {
      activeFilters.period = document.getElementById('unifiedPeriod').value;
      activeFilters.category = document.getElementById('unifiedCategory').value;
      activeFilters.bank = document.getElementById('unifiedBank').value;
      activeFilters.type = document.getElementById('unifiedType').value;
      activeFilters.search = document.getElementById('unifiedSearch').value;
      activeFilters.dateFrom = document.getElementById('unifiedDateFrom').value;
      activeFilters.dateTo = document.getElementById('unifiedDateTo').value;
    } else if (id === 'transactions') {
      activeFilters.period = document.getElementById('unifiedPeriodTxn').value;
      activeFilters.category = document.getElementById('unifiedCategoryTxn').value;
      activeFilters.bank = document.getElementById('unifiedBankTxn').value;
      activeFilters.type = document.getElementById('unifiedTypeTxn').value;
      activeFilters.search = document.getElementById('unifiedSearchTxn').value;
      activeFilters.dateFrom = document.getElementById('unifiedDateFromTxn').value;
      activeFilters.dateTo = document.getElementById('unifiedDateToTxn').value;
    } else if (id === 'categories') {
      activeFilters.period = document.getElementById('unifiedPeriodCat').value;
      activeFilters.type = document.getElementById('unifiedTypeCat').value;
      activeFilters.search = document.getElementById('unifiedSearchCat').value;
      activeFilters.dateFrom = document.getElementById('unifiedDateFromCat').value;
      activeFilters.dateTo = document.getElementById('unifiedDateToCat').value;
    }
  }
  try {
    // 1. Сначала пробуем загрузить из Firebase
    if (currentUser && currentUser.id) {
      let snapshot = await db.collection('transactions')
        .where('userId', '==', currentUser.id)
        .orderBy('date', 'desc')
        .get();
      if (!snapshot.empty) {
        let tx = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allTx = tx;
        allData = processData(tx);
        populateSelects(allData);
        updateUI(allData);
        updateCategoryUI(allData);
        updateAllCategoriesList(allData);
        updateDashboardYearly(allData);
        populateYearlyFilter(allData);
        loadSavedLayout();
        return;
      }
    }
    // 2. Если в Firebase пусто или нет юзера — грузим из Sheets
    google.script.run.withSuccessHandler(function (d) {
      if (d.error) { console.error('Data error:', d.message); return; }
      allData = d;
      allTx = d.transactions || [];
      txnAll = allTx.slice();
      populateSelects(d);
      updateUI(d);
      updateCategoryUI(d);
      updateAllCategoriesList(d);
      updateDashboardYearly(d);
      populateYearlyFilter(d);
      loadSavedLayout();
      // Сохраняем в Firebase для будущего быстрого доступа
      if (currentUser && currentUser.id && allTx.length > 0) {
        allTx.forEach(tx => {
          db.collection('transactions').doc(tx.id).set({
            ...tx,
            userId: currentUser.id
          }, { merge: true });
        });
      }
    }).withFailureHandler(function (err) {
      console.error('Load error:', err);
    }).getAppData({
      period: activeFilters.period === 'all' ? '' : activeFilters.period,
      category: activeFilters.category === 'all' ? '' : activeFilters.category,
      account: activeFilters.bank === 'all' ? '' : activeFilters.bank,
      search: activeFilters.search || '',
      type: activeFilters.type === 'all' ? '' : activeFilters.type,
      dateFrom: activeFilters.dateFrom || '',
      dateTo: activeFilters.dateTo || ''
    });
  } catch (e) {
    console.error('Firebase load error:', e);
  }
}

// ============================================
// ОБРАБОТКА ДАННЫХ
// ============================================
function processData(transactions) {
  var totalIncome = 0,
    totalExpense = 0;
  var months = {},
    categories = {},
    accounts = {},
    years = {},
    bankData = {},
    categoryIncome = {},
    categoryExpense = {};
  var monthLabels = [],
    monthIncome = [],
    monthExpense = [],
    monthDelta = [];
  transactions.forEach(function (t) {
    var absAmt = Math.abs(t.amount);
    if (t.type === 'Доход') {
      totalIncome += absAmt;
      categoryIncome[t.category] = (categoryIncome[t.category] || 0) + absAmt;
    } else {
      totalExpense += absAmt;
      categoryExpense[t.category] = (categoryExpense[t.category] || 0) + absAmt;
    }
    if (!bankData[t.bank]) bankData[t.bank] = { income: 0, expense: 0 };
    if (t.type === 'Доход') bankData[t.bank].income += absAmt;
    else bankData[t.bank].expense += absAmt;
    if (t.monthYear) months[t.monthYear] = true;
    categories[t.category] = true;
    accounts[t.account] = true;
    years[t.year] = true;
  });
  monthLabels = Object.keys(months).sort(function (a, b) {
    var partsA = a.split('.'),
      partsB = b.split('.');
    return new Date(partsA[1], partsA[0] - 1) - new Date(partsB[1], partsB[0] - 1);
  });
  monthLabels.forEach(function (m) {
    var inc = 0,
      exp = 0;
    transactions.forEach(function (t) {
      if (t.monthYear === m) {
        if (t.type === 'Доход') inc += Math.abs(t.amount);
        else exp += Math.abs(t.amount);
      }
    });
    monthIncome.push(inc);
    monthExpense.push(exp);
  });
  var cum = 0;
  monthLabels.forEach(function (m, idx) {
    cum += monthIncome[idx] - monthExpense[idx];
    monthDelta.push(cum);
  });
  return {
    transactions: transactions,
    totalIncome: Math.round(totalIncome * 100) / 100,
    totalExpense: Math.round(totalExpense * 100) / 100,
    balance: Math.round((totalIncome - totalExpense) * 100) / 100,
    count: transactions.length,
    monthLabels: monthLabels,
    monthIncome: monthIncome.map(v => Math.round(v * 100) / 100),
    monthExpense: monthExpense.map(v => Math.round(v * 100) / 100),
    monthDelta: monthDelta.map(v => Math.round(v * 100) / 100),
    categoryIncome: categoryIncome,
    categoryExpense: categoryExpense,
    bankData: bankData,
    bankLabels: Object.keys(bankData),
    bankIncomeData: Object.values(bankData).map(b => b.income),
    bankExpenseData: Object.values(bankData).map(b => b.expense),
    years: Object.keys(years).sort(),
    categories: Object.keys(categories).sort(),
    accounts: Object.keys(accounts).sort()
  };
}

// ============================================
// POPULATE SELECTS
// ============================================
function populateSelects(d) {
  var catSel = document.getElementById('unifiedCategory'),
    curCat = catSel.value;
  catSel.innerHTML = '<option value="all">Все категории</option>';
  (d.categories || []).forEach(function (v) {
    var o = document.createElement('option');
    o.value = v;
    o.text = v;
    catSel.appendChild(o);
  });
  catSel.value = curCat;

  var bankSel = document.getElementById('unifiedBank'),
    curBank = bankSel.value;
  bankSel.innerHTML = '<option value="all">Все банки</option>';
  (d.accounts || []).forEach(function (v) {
    var o = document.createElement('option');
    o.value = v;
    o.text = v;
    bankSel.appendChild(o);
  });
  bankSel.value = curBank;

  var catSelTxn = document.getElementById('unifiedCategoryTxn'),
    curCatTxn = catSelTxn.value;
  catSelTxn.innerHTML = '<option value="all">Все категории</option>';
  (d.categories || []).forEach(function (v) {
    var o = document.createElement('option');
    o.value = v;
    o.text = v;
    catSelTxn.appendChild(o);
  });
  catSelTxn.value = curCatTxn;

  var bankSelTxn = document.getElementById('unifiedBankTxn'),
    curBankTxn = bankSelTxn.value;
  bankSelTxn.innerHTML = '<option value="all">Все банки</option>';
  (d.accounts || []).forEach(function (v) {
    var o = document.createElement('option');
    o.value = v;
    o.text = v;
    bankSelTxn.appendChild(o);
  });
  bankSelTxn.value = curBankTxn;

  var mCat = document.getElementById('mCat');
  mCat.innerHTML = '<option value="Без категории">Без категории</option>';
  if (d.categories) {
    var catFrequency = {};
    (d.transactions || []).forEach(function (t) {
      var c = t.category || 'Без категории';
      catFrequency[c] = (catFrequency[c] || 0) + 1;
    });
    var sortedCats = d.categories.slice().sort(function (a, b) {
      return (catFrequency[b] || 0) - (catFrequency[a] || 0);
    });
    sortedCats.forEach(function (v) {
      var o = document.createElement('option');
      o.value = v;
      o.text = v + (catFrequency[v] ? ' (' + catFrequency[v] + ')' : '');
      mCat.appendChild(o);
    });
  }

  var mAcc = document.getElementById('mAcc');
  mAcc.innerHTML = '';
  if (d.settings && d.settings.accounts) {
    d.settings.accounts.forEach(function (v) {
      var o = document.createElement('option');
      o.value = v;
      o.text = v;
      mAcc.appendChild(o);
    });
  } else {
    ['Основной', 'Сберегательный', 'Кредитный'].forEach(function (v) {
      var o = document.createElement('option');
      o.value = v;
      o.text = v;
      mAcc.appendChild(o);
    });
  }

  var mBank = document.getElementById('mBank');
  mBank.innerHTML = '';
  if (d.settings && d.settings.banks) {
    d.settings.banks.forEach(function (v) {
      var o = document.createElement('option');
      o.value = v;
      o.text = v;
      mBank.appendChild(o);
    });
  } else {
    ['Сбербанк', 'Т-Банк', 'Альфа-Банк', 'ВТБ', 'Другой'].forEach(function (v) {
      var o = document.createElement('option');
      o.value = v;
      o.text = v;
      mBank.appendChild(o);
    });
  }
}

function populateYearlyFilter(d) {
  var sel = document.getElementById('yearlyFilter'),
    cur = sel.value;
  sel.innerHTML = '<option value="all">Все годы</option>';
  if (d.years) {
    var sortedYears = d.years.slice().sort(function (a, b) {
      return b - a;
    });
    sortedYears.forEach(function (v) {
      var o = document.createElement('option');
      o.value = v;
      o.text = v;
      sel.appendChild(o);
    });
  }
  sel.value = cur;
}

// ============================================
// ОБНОВЛЕНИЕ UI
// ============================================
function updateUI(d) {
  var income = d.totalIncome || 0,
    expense = d.totalExpense || 0,
    balance = d.balance || 0;
  var incomeEl = document.getElementById('kpiIncome'),
    expenseEl = document.getElementById('kpiExpense'),
    balanceEl = document.getElementById('kpiBalance');
  if (incomeEl) animateCounter(incomeEl, income, 800);
  if (expenseEl) animateCounter(expenseEl, expense, 800);
  if (balanceEl) animateCounter(balanceEl, balance, 800);
  document.getElementById('txnCount').textContent = (d.count || 0).toLocaleString();
  updateFinancialPulse(balance);
  updateDaySummary(d.transactions || []);
  updateTopCategories(d.categoryIncome || {}, d.categoryExpense || {});
  updateBudgetProgress(income, expense);
  updateTransactionList(d.transactions || []);
  updateCharts(d);
  updateExtraCharts(d);
}

function animateCounter(element, targetValue, duration) {
  var startTime = null,
    startValue = 0;

  function updateCounter(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var currentValue = Math.round(startValue + (targetValue - startValue) * progress);
    element.textContent = currentValue.toLocaleString() + ' ₽';
    if (progress < 1) requestAnimationFrame(updateCounter);
    else element.textContent = targetValue.toLocaleString() + ' ₽';
  }
  requestAnimationFrame(updateCounter);
}

function toggleWidget(element) {
  var isExpanded = element.dataset.expanded === 'true';
  var details = element.querySelector('.widget-details'),
    icon = element.querySelector('.expand-icon');
  if (isExpanded) {
    details.style.display = 'none';
    icon.textContent = '▼';
    element.dataset.expanded = 'false';
  } else {
    details.style.display = 'block';
    icon.textContent = '▲';
    element.dataset.expanded = 'true';
  }
}

function updateFinancialPulse(balance) {
  var pulseContent = document.getElementById('pulseContent');
  if (!pulseContent) return;
  var status, emoji, color, recommend;
  if (balance > 100000) {
    status = 'Отлично!';
    emoji = '🌟';
    color = '#00d4aa';
    recommend = 'Продолжайте в том же духе!';
  } else if (balance > 50000) {
    status = 'Хорошо';
    emoji = '😊';
    color = '#34d399';
    recommend = 'Стабильная финансовая ситуация';
  } else if (balance > 10000) {
    status = 'Нормально';
    emoji = '🙂';
    color = '#fbbf24';
    recommend = 'Обратите внимание на расходы';
  } else if (balance > 0) {
    status = 'Требует внимания';
    emoji = '😐';
    color = '#fb923c';
    recommend = 'Сократите необязательные расходы';
  } else {
    status = 'Критично!';
    emoji = '🚨';
    color = '#ff6b6b';
    recommend = 'Срочно пересмотрите бюджет!';
  }
  pulseContent.innerHTML = '<div style="display:flex;align-items:center;gap:12px;"><span style="font-size:28px;">' + emoji + '</span><div><div style="font-size:12px;color:var(--text-secondary);">Состояние</div><div style="font-size:18px;font-weight:700;color:' + color + ';">' + status + '</div><div style="font-size:12px;color:var(--text-secondary);">' + balance.toLocaleString() + ' ₽</div></div></div>';
  document.getElementById('pulseStatus').textContent = status;
  document.getElementById('pulseStatus').style.color = color;
  document.getElementById('pulseBalance').textContent = balance.toLocaleString() + ' ₽';
  document.getElementById('pulseRecommend').textContent = recommend;
}

function updateDaySummary(transactions) {
  var today = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  document.getElementById('todayDate').textContent = today;
  var todayTx = transactions.filter(function (t) {
    return t.date === today;
  });
  var income = 0,
    expense = 0;
  todayTx.forEach(function (t) {
    if (t.type === 'Доход') income += Math.abs(t.amount);
    else expense += Math.abs(t.amount);
  });
  document.getElementById('todayIncome').textContent = '+' + income.toLocaleString() + ' ₽';
  document.getElementById('todayExpense').textContent = '-' + expense.toLocaleString() + ' ₽';
  var count = todayTx.length,
    avg = count > 0 ? (income + expense) / count : 0,
    balance = income - expense;
  document.getElementById('dayCount').textContent = count;
  document.getElementById('dayAvg').textContent = avg.toLocaleString() + ' ₽';
  document.getElementById('dayBalance').textContent = balance.toLocaleString() + ' ₽';
  document.getElementById('dayBalance').className = 'value ' + (balance >= 0 ? 'positive' : 'negative');
}

function updateTopCategories(categoryIncome, categoryExpense) {
  var container = document.getElementById('topCategories');
  if (!container) return;
  var allCats = {};
  Object.keys(categoryIncome).forEach(function (cat) {
    allCats[cat] = (allCats[cat] || 0) + categoryIncome[cat];
  });
  Object.keys(categoryExpense).forEach(function (cat) {
    allCats[cat] = (allCats[cat] || 0) - categoryExpense[cat];
  });
  var sorted = Object.keys(allCats).sort(function (a, b) {
    return Math.abs(allCats[b]) - Math.abs(allCats[a]);
  }).slice(0, 3);
  var medals = ['🥇', '🥈', '🥉'];
  if (sorted.length === 0) {
    container.innerHTML = '<div style="color:var(--text-secondary);font-size:13px;text-align:center;padding:10px;">Нет данных</div>';
    return;
  }
  var html = '';
  sorted.forEach(function (cat, index) {
    var val = allCats[cat],
      sign = val >= 0 ? '+' : '',
      color = val >= 0 ? 'var(--secondary)' : 'var(--danger)';
    html += '<div><div class="top-cat-item" onclick="showTopCategoryModal(\'' + cat + '\')"><span class="medal">' + medals[index] + '</span><span class="cat-name">' + cat + '</span><span class="cat-amount" style="color:' + color + ';">' + sign + Math.abs(val).toLocaleString() + ' ₽</span></div></div>';
  });
  container.innerHTML = html;
}

function showTopCategoryModal(category) {
  var modal = document.getElementById('kpiModal');
  document.getElementById('kpiModalTitle').textContent = '🏆 ' + category;
  var content = document.getElementById('kpiModalContent');
  var tx = allData ? allData.transactions.filter(function (t) {
    return t.category === category;
  }) : [];
  var html = '';
  if (tx.length === 0) {
    html = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет транзакций</div>';
  } else {
    var total = 0;
    tx.forEach(function (t) {
      total += t.amount;
      var sign = t.type === 'Доход' ? '+' : '-';
      var color = t.type === 'Доход' ? 'var(--secondary)' : 'var(--danger)';
      html += '<div class="detail-item"><span>' + t.date + ' - ' + t.description + '</span><span style="color:' + color + ';">' + sign + Math.abs(t.amount).toLocaleString() + ' ₽</span></div>';
    });
    html += '<div class="detail-item" style="font-weight:bold;border-top:2px solid var(--border-color);padding-top:12px;margin-top:8px;"><span>ИТОГО</span><span style="color:' + (total >= 0 ? 'var(--secondary)' : 'var(--danger)') + ';">' + (total >= 0 ? '+' : '-') + Math.abs(total).toLocaleString() + ' ₽</span></div>';
  }
  content.innerHTML = html;
  modal.classList.add('active');
}

function updateBudgetProgress(totalIncome, totalExpense) {
  var percent = totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;
  var color = percent <= 50 ? 'var(--secondary)' : percent <= 80 ? '#fbbf24' : 'var(--danger)';
  document.getElementById('budgetPercent').textContent = percent + '%';
  document.getElementById('budgetFill').style.width = Math.min(percent, 100) + '%';
  document.getElementById('budgetFill').style.background = color;
  document.getElementById('budgetIncome').textContent = '💰 ' + totalIncome.toLocaleString() + ' ₽';
  document.getElementById('budgetExpense').textContent = '📉 ' + totalExpense.toLocaleString() + ' ₽';
  var remain = totalIncome - totalExpense;
  var daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  var dailyAvg = totalExpense / daysInMonth;
  var forecast = dailyAvg * 30;
  document.getElementById('budgetRemain').textContent = remain.toLocaleString() + ' ₽';
  document.getElementById('budgetRemain').className = 'value ' + (remain >= 0 ? 'positive' : 'negative');
  document.getElementById('budgetDaily').textContent = dailyAvg.toLocaleString() + ' ₽';
  document.getElementById('budgetForecast').textContent = forecast.toLocaleString() + ' ₽';
}

function updateTransactionList(transactions) {
  txnAll = transactions.slice();
  txnOffset = 0;
  renderTransactionPage();
}

function renderTransactionPage() {
  var container = document.getElementById('transactionList');
  var total = txnAll.length,
    end = Math.min(txnOffset + txnLimit, total);
  var items = txnAll.slice(txnOffset, end);
  var html = '';
  if (items.length === 0) {
    html = '<div class="empty-state"><div class="icon">📭</div><p>Нет операций</p></div>';
  } else {
    items.forEach(function (t) {
      var isInc = t.type === 'Доход',
        cls = isInc ? 'income' : 'expense',
        sign = isInc ? '+' : '−',
        emoji = isInc ? '📈' : '📉';
      html += '<div class="txn-item"><div class="icon ' + cls + '">' + emoji + '</div><div class="info"><div class="desc">' + escapeHtml(t.description) + '</div><div class="meta">' + (t.date || '') + ' • ' + (t.category || 'Без категории') + '</div></div><div class="txn-actions"><button class="edit-btn" onclick="event.stopPropagation(); editTransaction(\'' + t.id + '\')">✏️</button><button class="delete-btn" onclick="event.stopPropagation(); deleteTransaction(\'' + t.id + '\')">🗑️</button></div><div class="amount ' + cls + '">' + sign + ' ' + Math.abs(t.amount).toLocaleString() + ' ₽</div></div>';
    });
  }
  container.innerHTML = html;
  var loadMoreBtn = document.getElementById('txnLoadMore'),
    resetBtn = document.getElementById('txnReset');
  if (end >= total || total === 0) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'inline-block';
    loadMoreBtn.textContent = 'Показать ещё (' + Math.min(50, total - end) + ')';
  }
  resetBtn.style.display = txnOffset > 0 ? 'inline-block' : 'none';
  resetBtn.textContent = txnOffset > 0 ? 'Показать первые 50' : 'Скрыть';
}

function loadMoreTransactions() {
  txnOffset += txnLimit;
  renderTransactionPage();
}

function resetTransactions() {
  txnOffset = 0;
  renderTransactionPage();
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, function (m) {
    var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return map[m] || m;
  });
}

function updateCategoryUI(d) {
  if (!d) return;
  var incomeCats = d.categoryIncome || {},
    expenseCats = d.categoryExpense || {};
  var search = (document.getElementById('unifiedSearchCat') ? document.getElementById('unifiedSearchCat').value || '' : '').toLowerCase();
  var filteredIncome = {},
    filteredExpense = {};
  Object.keys(incomeCats).forEach(function (cat) {
    if (search && cat.toLowerCase().indexOf(search) === -1) return;
    filteredIncome[cat] = incomeCats[cat];
  });
  Object.keys(expenseCats).forEach(function (cat) {
    if (search && cat.toLowerCase().indexOf(search) === -1) return;
    filteredExpense[cat] = expenseCats[cat];
  });
  var incomeKeys = Object.keys(filteredIncome).sort(function (a, b) {
    return filteredIncome[b] - filteredIncome[a];
  });
  var expenseKeys = Object.keys(filteredExpense).sort(function (a, b) {
    return filteredExpense[b] - filteredExpense[a];
  });
  renderCategoryBlock('incomeCategoryList', incomeKeys, filteredIncome, '💰', '#00d4aa', 'income');
  renderCategoryBlock('expenseCategoryList', expenseKeys, filteredExpense, '📉', '#ff6b6b', 'expense');
  renderCategoryBlock('allIncomeCategories', incomeKeys, filteredIncome, '💰', '#00d4aa', 'income');
  renderCategoryBlock('allExpenseCategories', expenseKeys, filteredExpense, '📉', '#ff6b6b', 'expense');
}

function renderCategoryBlock(containerId, keys, data, emoji, color, type) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var isExpanded = categoryListsExpanded[type] || false;
  var displayKeys = isExpanded ? keys : keys.slice(0, 5);
  var html = '';
  if (keys.length === 0) {
    html = '<div class="empty-state" style="padding:10px;">Нет данных</div>';
  } else {
    displayKeys.forEach(function (cat) {
      var val = data[cat],
        sign = type === 'income' ? '+' : '-',
        colorVal = type === 'income' ? '#00d4aa' : '#ff6b6b';
      html += '<div class="cat-row" onclick="showCategoryDetail(\'' + cat + '\')"><span class="cat-name">' + cat + '</span><span class="total" style="color:' + colorVal + ';">' + sign + val.toLocaleString() + ' ₽</span></div>';
    });
    if (keys.length > 5) {
      var moreBtn = container.parentElement.querySelector('.cat-more-btn');
      if (moreBtn) moreBtn.textContent = isExpanded ? 'Скрыть' : 'Показать все (' + keys.length + ')';
    }
  }
  container.innerHTML = html;
}

function showCategoryDetail(category) {
  var modal = document.getElementById('kpiModal');
  document.getElementById('kpiModalTitle').textContent = '📊 ' + category;
  var content = document.getElementById('kpiModalContent');
  var tx = allData ? allData.transactions.filter(function (t) {
    return t.category === category;
  }) : [];
  var html = '';
  if (tx.length === 0) {
    html = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет транзакций</div>';
  } else {
    var total = 0;
    tx.forEach(function (t) {
      total += t.amount;
      var sign = t.type === 'Доход' ? '+' : '-';
      var color = t.type === 'Доход' ? 'var(--secondary)' : 'var(--danger)';
      html += '<div class="detail-item"><span>' + t.date + ' - ' + t.description + '</span><span style="color:' + color + ';">' + sign + Math.abs(t.amount).toLocaleString() + ' ₽</span></div>';
    });
    html += '<div class="detail-item" style="font-weight:bold;border-top:2px solid var(--border-color);padding-top:12px;margin-top:8px;"><span>ИТОГО</span><span style="color:' + (total >= 0 ? 'var(--secondary)' : 'var(--danger)') + ';">' + (total >= 0 ? '+' : '-') + Math.abs(total).toLocaleString() + ' ₽</span></div>';
  }
  content.innerHTML = html;
  modal.classList.add('active');
}

function toggleCategoryList(type) {
  categoryListsExpanded[type] = !categoryListsExpanded[type];
  refreshData();
}

function updateAllCategoriesList(d) {
  var container = document.getElementById('allCategoriesList');
  if (!container) return;
  var cats = d.categories || [];
  var search = (document.getElementById('unifiedSearchCat') ? document.getElementById('unifiedSearchCat').value || '' : '').toLowerCase();
  var filtered = cats.filter(function (c) {
    return !search || c.toLowerCase().indexOf(search) !== -1;
  });
  var display = allCategoriesExpanded ? filtered : filtered.slice(0, 10);
  var html = '';
  if (filtered.length === 0) {
    html = '<div class="empty-state" style="padding:10px;">Нет категорий</div>';
  } else {
    display.forEach(function (c) {
      html += '<div class="cat-row"><span class="cat-name">' + c + '</span><div class="cat-actions"><button class="edit-cat-btn" onclick="event.stopPropagation();showEditCategoryModal(\'' + c + '\')">✏️</button><button class="delete-cat-btn" onclick="event.stopPropagation();deleteCategory(\'' + c + '\')">🗑️</button></div></div>';
    });
    if (filtered.length > 10) {
      var moreBtn = container.parentElement.querySelector('.cat-more-btn');
      if (moreBtn) moreBtn.textContent = allCategoriesExpanded ? 'Скрыть' : 'Показать все (' + filtered.length + ')';
    }
  }
  container.innerHTML = html;
}

function toggleAllCategories() {
  allCategoriesExpanded = !allCategoriesExpanded;
  refreshData();
}

// ============================================
// КАТЕГОРИИ (CRUD)
// ============================================
function showEditCategoryModal(categoryName) {
  var catData = allData ? allData.categories || [] : [];
  var found = catData.find(function (c) {
    return c === categoryName;
  });
  if (!found) return;
  document.getElementById('editCategoryModal').classList.add('active');
  document.getElementById('editCatOldName').value = categoryName;
  document.getElementById('editCatName').value = categoryName;
  document.getElementById('editCatEmoji').value = '📌';
  document.getElementById('editCatType').value = 'Расход';
  document.getElementById('editCatSub').value = 'Разное';
  document.getElementById('editCatError').style.display = 'none';
  document.getElementById('editCatSuccess').style.display = 'none';
}

function closeEditCategoryModal() {
  document.getElementById('editCategoryModal').classList.remove('active');
}

function updateCategory() {
  var oldName = document.getElementById('editCatOldName').value;
  var name = document.getElementById('editCatName').value.trim();
  var emoji = document.getElementById('editCatEmoji').value.trim() || '📌';
  var type = document.getElementById('editCatType').value;
  var sub = document.getElementById('editCatSub').value.trim() || 'Разное';
  if (!name) {
    document.getElementById('editCatError').textContent = 'Введите название категории';
    document.getElementById('editCatError').style.display = 'block';
    return;
  }
  google.script.run.withSuccessHandler(function (result) {
    if (result.success) {
      document.getElementById('editCatSuccess').style.display = 'block';
      setTimeout(function () {
        closeEditCategoryModal();
        refreshData();
      }, 1000);
    } else {
      document.getElementById('editCatError').textContent = result.error || 'Ошибка обновления';
      document.getElementById('editCatError').style.display = 'block';
    }
  }).withFailureHandler(function (err) {
    document.getElementById('editCatError').textContent = 'Ошибка: ' + err;
    document.getElementById('editCatError').style.display = 'block';
  }).updateCategory(oldName, name, emoji, type, sub);
}

function deleteCategory(name) {
  if (!confirm('Удалить категорию "' + name + '" ?')) return;
  google.script.run.withSuccessHandler(function (result) {
    if (result.success) {
      showToast('Категория удалена', 'Успешно');
      refreshData();
    } else {
      showToast(result.error || 'Ошибка удаления', 'Ошибка');
    }
  }).deleteCategory(name);
}

// ============================================
// ЧАРТЫ
// ============================================
function updateCharts(d) {
  if (typeof Chart === 'undefined') return;
  var ctx1 = document.getElementById('cCat');
  if (ctx1) {
    ctx1 = ctx1.getContext('2d');
    if (chartCat) chartCat.destroy();
    var cLabels = d.categoryLabels || ['Нет данных'],
      cData = d.categoryData || [1];
    var colors = ['#6c5ce7', '#00d4aa', '#ff6b6b', '#ffa94d', '#a29bfe', '#00b4d8', '#f472b8', '#34d399'];
    chartCat = new Chart(ctx1, {
      type: 'doughnut',
      data: { labels: cLabels, datasets: [{ data: cData, backgroundColor: colors.slice(0, cLabels.length), borderWidth: 2, borderColor: '#1a1a2e' }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#8b8ba3', boxWidth: 12, font: { size: 8 } } } } }
    });
  }
  var ctx2 = document.getElementById('cBank');
  if (ctx2) {
    ctx2 = ctx2.getContext('2d');
    if (chartBank) chartBank.destroy();
    var bankLabels = d.bankLabels || ['Нет данных'],
      bankExpenseData = d.bankExpenseData || [1];
    var bankColors = ['#f472b6', '#34d399', '#60a5fa', '#fbbf24', '#a78bfa', '#fb923c', '#2dd4bf', '#f87171'];
    chartBank = new Chart(ctx2, {
      type: 'doughnut',
      data: { labels: bankLabels, datasets: [{ data: bankExpenseData, backgroundColor: bankColors.slice(0, bankLabels.length), borderWidth: 2, borderColor: '#1a1a2e' }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#8b8ba3', boxWidth: 12, font: { size: 8 } } } } }
    });
  }
  var ctx3 = document.getElementById('cTrend');
  if (ctx3) {
    ctx3 = ctx3.getContext('2d');
    if (chartTrend) chartTrend.destroy();
    var labels = d.monthLabels || [],
      incomeData = d.monthIncome || [],
      expenseData = d.monthExpense || [];
    chartTrend = new Chart(ctx3, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          { label: 'Доходы', data: incomeData, borderColor: '#00d4aa', backgroundColor: 'rgba(0,212,170,0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#00d4aa', pointBorderColor: '#00d4aa' },
          { label: 'Расходы', data: expenseData, borderColor: '#ff6b6b', backgroundColor: 'rgba(255,107,107,0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#ff6b6b', pointBorderColor: '#ff6b6b' }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b8ba3', font: { size: 10 } } } }, scales: { y: { ticks: { color: '#8b8ba3' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#8b8ba3', maxRotation: 45 }, grid: { color: 'rgba(255,255,255,0.05)' } } } }
    });
  }
  var ctx4 = document.getElementById('cMonthly');
  if (ctx4) {
    ctx4 = ctx4.getContext('2d');
    if (chartMonthly) chartMonthly.destroy();
    var monthLabels = d.monthLabels || [],
      monthIncome = d.monthIncome || [],
      monthExpense = d.monthExpense || [];
    chartMonthly = new Chart(ctx4, {
      type: 'bar',
      data: {
        labels: monthLabels,
        datasets: [
          { label: 'Доходы', data: monthIncome, backgroundColor: 'rgba(0,212,170,0.6)', borderColor: '#00d4aa', borderWidth: 1 },
          { label: 'Расходы', data: monthExpense, backgroundColor: 'rgba(255,107,107,0.6)', borderColor: '#ff6b6b', borderWidth: 1 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b8ba3', font: { size: 10 } } } }, scales: { y: { ticks: { color: '#8b8ba3' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }, x: { ticks: { color: '#8b8ba3', maxRotation: 45 }, grid: { color: 'rgba(255,255,255,0.05)' } } } }
    });
  }
  var ctx5 = document.getElementById('cHeatmap');
  if (ctx5) {
    ctx5 = ctx5.getContext('2d');
    if (chartHeatmap) chartHeatmap.destroy();
    var dayNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
      dayData = [0, 0, 0, 0, 0, 0, 0];
    (d.transactions || []).forEach(function (t) {
      if (t.type === 'Расход' && t.date) {
        var parts = t.date.split('.');
        if (parts.length === 3) {
          var dt = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          var day = dt.getDay();
          dayData[day === 0 ? 6 : day - 1] += Math.abs(t.amount);
        }
      }
    });
    var maxDay = Math.max.apply(null, dayData.concat([1]));
    chartHeatmap = new Chart(ctx5, {
      type: 'bar',
      data: {
        labels: dayNames,
        datasets: [{
          label: 'Расходы по дням недели',
          data: dayData,
          backgroundColor: dayData.map(function (val) {
            var ratio = val / maxDay;
            if (ratio < 0.2) return 'rgba(52,152,219,0.3)';
            if (ratio < 0.4) return 'rgba(52,152,219,0.5)';
            if (ratio < 0.6) return 'rgba(241,196,15,0.6)';
            if (ratio < 0.8) return 'rgba(243,156,18,0.7)';
            return 'rgba(231,76,60,0.8)';
          }),
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1
        }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#8b8ba3' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }, x: { ticks: { color: '#8b8ba3' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }
    });
  }
}

function updateExtraCharts(d) {
  if (typeof Chart === 'undefined') return;
  var ctx1 = document.getElementById('cWeeklyTrend');
  if (ctx1) {
    ctx1 = ctx1.getContext('2d');
    if (chartWeeklyTrend) chartWeeklyTrend.destroy();
    var dayNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
      dayData = [0, 0, 0, 0, 0, 0, 0];
    (d.transactions || []).forEach(function (t) {
      if (t.type === 'Расход' && t.date) {
        var parts = t.date.split('.');
        if (parts.length === 3) {
          var dt = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          var day = dt.getDay();
          dayData[day === 0 ? 6 : day - 1] += Math.abs(t.amount);
        }
      }
    });
    chartWeeklyTrend = new Chart(ctx1, {
      type: 'bar',
      data: { labels: dayNames, datasets: [{ label: 'Расходы', data: dayData, backgroundColor: 'rgba(255,107,107,0.6)', borderColor: '#ff6b6b', borderWidth: 1 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b8ba3' } } }, scales: { y: { beginAtZero: true } } }
    });
  }
  var ctx2 = document.getElementById('cCategoryCompare');
  if (ctx2) {
    ctx2 = ctx2.getContext('2d');
    if (chartCategoryCompare) chartCategoryCompare.destroy();
    var cats = Object.keys(d.categoryIncome || {}).concat(Object.keys(d.categoryExpense || {}));
    var uniqueCats = [...new Set(cats)];
    var incomeData = uniqueCats.map(c => d.categoryIncome[c] || 0);
    var expenseData = uniqueCats.map(c => d.categoryExpense[c] || 0);
    chartCategoryCompare = new Chart(ctx2, {
      type: 'bar',
      data: { labels: uniqueCats, datasets: [{ label: 'Доходы', data: incomeData, backgroundColor: 'rgba(0,212,170,0.6)', borderColor: '#00d4aa', borderWidth: 1 }, { label: 'Расходы', data: expenseData, backgroundColor: 'rgba(255,107,107,0.6)', borderColor: '#ff6b6b', borderWidth: 1 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b8ba3' } } }, scales: { y: { beginAtZero: true } } }
    });
  }
  var ctx3 = document.getElementById('cCumulative');
  if (ctx3) {
    ctx3 = ctx3.getContext('2d');
    if (chartCumulative) chartCumulative.destroy();
    var monthLabels = d.monthLabels || [];
    var monthCumulative = [];
    var cum = 0;
    monthLabels.forEach(function (m) {
      var inc = 0,
        exp = 0;
      d.transactions.forEach(function (t) {
        if (t.monthYear === m) {
          if (t.type === 'Доход') inc += Math.abs(t.amount);
          else exp += Math.abs(t.amount);
        }
      });
      cum += (inc - exp);
      monthCumulative.push(cum);
    });
    chartCumulative = new Chart(ctx3, {
      type: 'line',
      data: { labels: monthLabels, datasets: [{ label: 'Накопленный баланс', data: monthCumulative, borderColor: '#6c5ce7', backgroundColor: 'rgba(108,92,231,0.1)', fill: true, tension: 0.4 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b8ba3' } } }, scales: { y: { beginAtZero: true } } }
    });
  }
}

function updateDashboardYearly(d) {
  var container = document.getElementById('dashboardYearlyAnalytics');
  if (!container) return;
  var yearlyData = d.yearlyData || {};
  var years = Object.keys(yearlyData).sort(function (a, b) {
    return b - a;
  });
  var selectedYear = document.getElementById('yearlyFilter').value;
  if (selectedYear !== 'all') {
    years = years.filter(function (y) {
      return y == selectedYear;
    });
  }
  if (years.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет данных</div>';
    return;
  }
  var html = '<div class="yearly-table"><table>';
  html += '<thead><tr><th>Год</th><th style="text-align:right;">💰 Доходы</th><th style="text-align:right;">📉 Расходы</th><th style="text-align:right;">⚖️ Баланс</th><th style="text-align:right;">📊 Операций</th><th style="text-align:right;">📈 Средний чек</th><th style="text-align:right;">📊 Ср. доход</th><th style="text-align:right;">📊 Ср. расход</th></tr></thead><tbody>';
  years.forEach(function (year) {
    var yData = yearlyData[year] || {};
    var totalIncome = yData.income || 0,
      totalExpense = yData.expense || 0,
      balance = totalIncome - totalExpense,
      count = yData.count || 0,
      avgCheck = count > 0 ? (totalIncome + totalExpense) / count : 0,
      avgIncome = yData.incomeCount > 0 ? totalIncome / yData.incomeCount : 0,
      avgExpense = yData.expenseCount > 0 ? totalExpense / yData.expenseCount : 0;
    var balanceColor = balance >= 0 ? 'var(--secondary)' : 'var(--danger)';
    html += '<tr class="year-row" onclick="toggleYearDetailDashboard(this)">';
    html += '<td style="font-weight:600;color:var(--primary);">' + year + '</td>';
    html += '<td style="text-align:right;color:var(--secondary);">+' + totalIncome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽</td>';
    html += '<td style="text-align:right;color:var(--danger);">-' + totalExpense.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽</td>';
    html += '<td style="text-align:right;color:' + balanceColor + ';">' + (balance >= 0 ? '+' : '') + balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽</td>';
    html += '<td style="text-align:right;">' + count + '</td>';
    html += '<td style="text-align:right;">' + avgCheck.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽</td>';
    html += '<td style="text-align:right;color:var(--secondary);">+' + avgIncome.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽</td>';
    html += '<td style="text-align:right;color:var(--danger);">-' + avgExpense.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽</td>';
    html += '</tr>';
    html += '<tr class="year-detail-row" style="display:none;"><td colspan="8">';
    html += '<div class="year-detail-grid">';
    var categories = yData.categories || {};
    var catKeys = Object.keys(categories).sort(function (a, b) {
      return (Math.abs(categories[b].income) + Math.abs(categories[b].expense)) - (Math.abs(categories[a].income) + Math.abs(categories[a].expense));
    });
    if (catKeys.length > 0) {
      html += '<div class="detail-block"><h5>📊 По категориям</h5>';
      catKeys.slice(0, 10).forEach(function (cat) {
        var inc = categories[cat].income || 0,
          exp = categories[cat].expense || 0;
        if (inc > 0 || exp > 0) {
          html += '<div class="item"><span>' + cat + '</span><span><span style="color:var(--secondary);">+' + inc.toFixed(2) + '₽</span> <span style="color:var(--danger);">-' + exp.toFixed(2) + '₽</span></span></div>';
        }
      });
      if (catKeys.length > 10) html += '<div style="font-size:10px;color:var(--text-secondary);text-align:center;padding-top:4px;">и еще ' + (catKeys.length - 10) + ' категорий</div>';
      html += '</div>';
    }
    var months = yData.months || {};
    var monthKeys = Object.keys(months).sort();
    if (monthKeys.length > 0) {
      html += '<div class="detail-block"><h5>📅 По месяцам</h5>';
      monthKeys.forEach(function (month) {
        var mData = months[month] || {};
        var inc = mData.income || 0,
          exp = mData.expense || 0,
          bal = inc - exp;
        var color = bal >= 0 ? 'var(--secondary)' : 'var(--danger)';
        html += '<div class="item"><span>' + month + '</span><span><span style="color:var(--secondary);">+' + inc.toFixed(2) + '₽</span> <span style="color:var(--danger);">-' + exp.toFixed(2) + '₽</span> → <span style="color:' + color + ';">' + (bal >= 0 ? '+' : '') + bal.toFixed(2) + '₽</span></span></div>';
      });
      html += '</div>';
    }
    html += '</div></td></tr>';
  });
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

function toggleYearDetailDashboard(row) {
  var detailRow = row.nextElementSibling;
  if (detailRow && detailRow.classList.contains('year-detail-row')) {
    detailRow.style.display = detailRow.style.display === 'none' ? 'table-row' : 'none';
  }
}

// ============================================
// СРАВНЕНИЕ ПЕРИОДОВ
// ============================================
function comparePeriods() {
  var period1 = document.getElementById('comparePeriod1').value,
    period2 = document.getElementById('comparePeriod2').value;
  var dateFrom1 = document.getElementById('compareDateFrom1').value,
    dateTo1 = document.getElementById('compareDateTo1').value;
  var dateFrom2 = document.getElementById('compareDateFrom2').value,
    dateTo2 = document.getElementById('compareDateTo2').value;
  var filters1 = { period: period1, dateFrom: dateFrom1, dateTo: dateTo1, category: 'all', bank: 'all', type: 'all', search: '' };
  var filters2 = { period: period2, dateFrom: dateFrom2, dateTo: dateTo2, category: 'all', bank: 'all', type: 'all', search: '' };
  document.getElementById('compareResult').innerHTML = '<div class="loading-dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
  google.script.run.withSuccessHandler(function (d1) {
    google.script.run.withSuccessHandler(function (d2) {
      renderCompareResult(d1, d2, period1, period2);
    }).withFailureHandler(function (err) {
      showToast('Ошибка загрузки данных 2: ' + err, 'Ошибка');
    }).getAppData(filters2);
  }).withFailureHandler(function (err) {
    showToast('Ошибка загрузки данных 1: ' + err, 'Ошибка');
  }).getAppData(filters1);
}

function renderCompareResult(d1, d2, label1, label2) {
  var container = document.getElementById('compareResult');
  var html = '<div style="overflow-x:auto;margin-top:10px;">';
  html += '<table style="width:100%;border-collapse:collapse;font-size:12px;">';
  html += '<thead><tr style="background:#1A237E;color:white;">';
  html += '<th style="padding:8px 12px;">Показатель</th>';
  html += '<th style="padding:8px 12px;text-align:right;">' + getPeriodLabel(label1) + '</th>';
  html += '<th style="padding:8px 12px;text-align:right;">' + getPeriodLabel(label2) + '</th>';
  html += '<th style="padding:8px 12px;text-align:right;">Разница</th>';
  html += '</tr></thead><tbody>';
  var metrics = [
    { label: '💰 Доходы', val1: d1.totalIncome || 0, val2: d2.totalIncome || 0, color1: 'var(--secondary)', color2: 'var(--secondary)' },
    { label: '📉 Расходы', val1: d1.totalExpense || 0, val2: d2.totalExpense || 0, color1: 'var(--danger)', color2: 'var(--danger)' },
    { label: '⚖️ Баланс', val1: (d1.totalIncome || 0) - (d1.totalExpense || 0), val2: (d2.totalIncome || 0) - (d2.totalExpense || 0), color1: 'var(--primary)', color2: 'var(--primary)' },
    { label: '📊 Операций', val1: d1.count || 0, val2: d2.count || 0, color1: '#8b8ba3', color2: '#8b8ba3' },
    { label: '📈 Средний чек', val1: d1.avgTotal || 0, val2: d2.avgTotal || 0, color1: '#8b8ba3', color2: '#8b8ba3' }
  ];
  metrics.forEach(function (m) {
    var diff = m.val1 - m.val2;
    var diffColor = diff > 0 ? 'var(--secondary)' : diff < 0 ? 'var(--danger)' : '#8b8ba3';
    var sign = diff > 0 ? '+' : '';
    html += '<tr style="border-bottom:1px solid var(--border-color);">';
    html += '<td style="padding:6px 12px;">' + m.label + '</td>';
    html += '<td style="padding:6px 12px;text-align:right;color:' + m.color1 + ';">' + m.val1.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽</td>';
    html += '<td style="padding:6px 12px;text-align:right;color:' + m.color2 + ';">' + m.val2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽</td>';
    html += '<td style="padding:6px 12px;text-align:right;color:' + diffColor + ';font-weight:600;">' + sign + diff.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽</td>';
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

function getPeriodLabel(period) {
  var map = { 'currentMonth': 'Текущий месяц', 'lastMonth': 'Прошлый месяц', '6months': '6 месяцев', 'currentYear': 'Текущий год', '12months': 'Последние 12 мес', 'custom': 'Произвольный' };
  return map[period] || period;
}

function resetCompareFilters() {
  document.getElementById('comparePeriod1').value = 'currentMonth';
  document.getElementById('comparePeriod2').value = 'lastMonth';
  document.getElementById('compareDateFrom1').value = '';
  document.getElementById('compareDateTo1').value = '';
  document.getElementById('compareDateFrom2').value = '';
  document.getElementById('compareDateTo2').value = '';
  document.getElementById('compareDateFrom1').style.display = 'none';
  document.getElementById('compareDateTo1').style.display = 'none';
  document.getElementById('compareDateFrom2').style.display = 'none';
  document.getElementById('compareDateTo2').style.display = 'none';
  comparePeriods();
}

// ============================================
// ДЕТАЛИЗАЦИЯ (МОДАЛЬНЫЕ ОКНА)
// ============================================
function showChartDetail(type) {
  var modal = document.getElementById('kpiModal'),
    title = document.getElementById('kpiModalTitle'),
    content = document.getElementById('kpiModalContent');
  var data = allData;
  if (!data) return;
  var html = '';
  if (type === 'category') {
    title.textContent = '🥧 Детализация расходов по категориям';
    var cats = data.categoryLabels || [],
      vals = data.categoryData || [];
    if (cats.length === 0 || vals.length === 0) {
      html = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет данных</div>';
    } else {
      var total = vals.reduce(function (a, b) { return a + b; }, 0);
      cats.forEach(function (cat, idx) {
        var val = vals[idx] || 0,
          percent = total > 0 ? Math.round((val / total) * 100) : 0;
        html += '<div class="detail-item"><span>' + cat + '</span><span style="color:var(--danger);">-' + val.toFixed(2) + ' ₽ (' + percent + '%)</span></div>';
      });
      html += '<div class="detail-item" style="font-weight:bold;border-top:2px solid var(--border-color);padding-top:12px;margin-top:8px;"><span>ИТОГО</span><span style="color:var(--danger);">-' + total.toFixed(2) + ' ₽</span></div>';
    }
  } else if (type === 'bank') {
    title.textContent = '🏦 Детализация по банкам';
    var banks = data.bankLabels || [],
      bankData = data.bankData || {};
    if (banks.length === 0) {
      html = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет данных</div>';
    } else {
      banks.forEach(function (bank) {
        var inc = bankData[bank] ? bankData[bank].income || 0 : 0,
          exp = bankData[bank] ? bankData[bank].expense || 0 : 0;
        html += '<div class="detail-item"><span>' + bank + '</span><span><span style="color:var(--secondary);">+' + inc.toFixed(2) + ' ₽</span> / <span style="color:var(--danger);">-' + exp.toFixed(2) + ' ₽</span></span></div>';
      });
    }
  } else if (type === 'trend' || type === 'yearlyTrend') {
    title.textContent = '📈 Детализация динамики доходов и расходов';
    var labels = data.monthLabels || [],
      incomeData = data.monthIncome || [],
      expenseData = data.monthExpense || [];
    if (labels.length === 0) {
      html = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет данных</div>';
    } else {
      labels.forEach(function (label, idx) {
        var inc = incomeData[idx] || 0,
          exp = expenseData[idx] || 0,
          bal = inc - exp,
          color = bal >= 0 ? 'var(--secondary)' : 'var(--danger)';
        html += '<div class="detail-item"><span>' + label + '</span><span><span style="color:var(--secondary);">+' + inc.toFixed(2) + ' ₽</span> / <span style="color:var(--danger);">-' + exp.toFixed(2) + ' ₽</span> → <span style="color:' + color + ';">' + (bal >= 0 ? '+' : '') + bal.toFixed(2) + ' ₽</span></span></div>';
      });
    }
  } else if (type === 'monthly' || type === 'yearlyMonthly') {
    title.textContent = '📊 Детализация доходов и расходов по месяцам';
    var mlabels = data.monthLabels || [],
      mincome = data.monthIncome || [],
      mexpense = data.monthExpense || [];
    if (mlabels.length === 0) {
      html = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет данных</div>';
    } else {
      mlabels.forEach(function (label, idx) {
        var inc = mincome[idx] || 0,
          exp = mexpense[idx] || 0;
        html += '<div class="detail-item"><span>' + label + '</span><span><span style="color:var(--secondary);">+' + inc.toFixed(2) + ' ₽</span> / <span style="color:var(--danger);">-' + exp.toFixed(2) + ' ₽</span></span></div>';
      });
    }
  } else if (type === 'heatmap' || type === 'yearlyHeatmap') {
    title.textContent = '🔥 Тепловая карта расходов по дням недели';
    var dayNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
      dayData = [0, 0, 0, 0, 0, 0, 0];
    (data.transactions || []).forEach(function (t) {
      if (t.type === 'Расход' && t.date) {
        var parts = t.date.split('.');
        if (parts.length === 3) {
          var dt = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          var day = dt.getDay();
          dayData[day === 0 ? 6 : day - 1] += Math.abs(t.amount);
        }
      }
    });
    var hasData = false;
    dayNames.forEach(function (name, idx) {
      if (dayData[idx] > 0) hasData = true;
      var val = dayData[idx] || 0,
        color = val > 0 ? 'var(--danger)' : 'var(--text-secondary)';
      html += '<div class="detail-item"><span>' + name + '</span><span style="color:' + color + ';">' + (val > 0 ? val.toFixed(2) + ' ₽' : '0 ₽') + '</span></div>';
    });
    if (!hasData) html = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет данных</div>';
  } else if (type === 'weeklyTrend') {
    title.textContent = '📈 Тренд по дням недели';
    var dayNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
      dayData = [0, 0, 0, 0, 0, 0, 0];
    (data.transactions || []).forEach(function (t) {
      if (t.type === 'Расход' && t.date) {
        var parts = t.date.split('.');
        if (parts.length === 3) {
          var dt = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          var day = dt.getDay();
          dayData[day === 0 ? 6 : day - 1] += Math.abs(t.amount);
        }
      }
    });
    var hasData = false;
    dayNames.forEach(function (name, idx) {
      if (dayData[idx] > 0) hasData = true;
      var val = dayData[idx] || 0,
        color = val > 0 ? 'var(--danger)' : 'var(--text-secondary)';
      html += '<div class="detail-item"><span>' + name + '</span><span style="color:' + color + ';">' + (val > 0 ? val.toFixed(2) + ' ₽' : '0 ₽') + '</span></div>';
    });
    if (!hasData) html = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет данных</div>';
  } else if (type === 'categoryCompare') {
    title.textContent = '📊 Сравнение категорий (доходы/расходы)';
    var cats = Object.keys(data.categoryIncome || {}).concat(Object.keys(data.categoryExpense || {}));
    var uniqueCats = [...new Set(cats)];
    if (uniqueCats.length === 0) {
      html = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет данных</div>';
    } else {
      uniqueCats.forEach(function (cat) {
        var inc = data.categoryIncome[cat] || 0,
          exp = data.categoryExpense[cat] || 0;
        html += '<div class="detail-item"><span>' + cat + '</span><span><span style="color:var(--secondary);">+' + inc.toFixed(2) + ' ₽</span> / <span style="color:var(--danger);">-' + exp.toFixed(2) + ' ₽</span></span></div>';
      });
    }
  } else if (type === 'cumulative') {
    title.textContent = '📈 Накопленный баланс';
    var monthLabels = data.monthLabels || [];
    var cumulative = [];
    var cum = 0;
    monthLabels.forEach(function (m) {
      var inc = 0,
        exp = 0;
      data.transactions.forEach(function (t) {
        if (t.monthYear === m) {
          if (t.type === 'Доход') inc += Math.abs(t.amount);
          else exp += Math.abs(t.amount);
        }
      });
      cum += (inc - exp);
      cumulative.push(cum);
    });
    if (cumulative.length === 0) {
      html = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет данных</div>';
    } else {
      cumulative.forEach(function (val, idx) {
        html += '<div class="detail-item"><span>' + monthLabels[idx] + '</span><span style="color:' + (val >= 0 ? 'var(--secondary)' : 'var(--danger)') + ';">' + (val >= 0 ? '+' : '') + val.toFixed(2) + ' ₽</span></div>';
      });
    }
  }
  content.innerHTML = html;
  modal.classList.add('active');
}

function closeKpiModal() {
  document.getElementById('kpiModal').classList.remove('active');
}

function showKpiDetail(type) {
  var modal = document.getElementById('kpiModal'),
    title = document.getElementById('kpiModalTitle'),
    content = document.getElementById('kpiModalContent');
  var data = allData;
  if (!data) return;
  var html = '';
  if (type === 'income') {
    title.textContent = '💰 Детализация доходов';
    var incomeCats = data.categoryIncome || {};
    var keys = Object.keys(incomeCats).sort(function (a, b) {
      return incomeCats[b] - incomeCats[a];
    });
    if (keys.length === 0) {
      html = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет доходов</div>';
    } else {
      keys.forEach(function (cat) {
        html += '<div class="detail-item"><span>' + cat + '</span><span style="color:var(--secondary);">+' + incomeCats[cat].toFixed(2) + ' ₽</span></div>';
      });
      html += '<div class="detail-item" style="font-weight:bold;border-top:2px solid var(--border-color);padding-top:12px;margin-top:8px;"><span>ИТОГО</span><span style="color:var(--secondary);">+' + data.totalIncome.toFixed(2) + ' ₽</span></div>';
    }
  } else if (type === 'expense') {
    title.textContent = '📉 Детализация расходов';
    var expenseCats = data.categoryExpense || {};
    var keys = Object.keys(expenseCats).sort(function (a, b) {
      return expenseCats[b] - expenseCats[a];
    });
    if (keys.length === 0) {
      html = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет расходов</div>';
    } else {
      keys.forEach(function (cat) {
        html += '<div class="detail-item"><span>' + cat + '</span><span style="color:var(--danger);">-' + expenseCats[cat].toFixed(2) + ' ₽</span></div>';
      });
      html += '<div class="detail-item" style="font-weight:bold;border-top:2px solid var(--border-color);padding-top:12px;margin-top:8px;"><span>ИТОГО</span><span style="color:var(--danger);">-' + data.totalExpense.toFixed(2) + ' ₽</span></div>';
    }
  } else if (type === 'balance') {
    title.textContent = '⚖️ Детализация баланса';
    var incomeCats2 = data.categoryIncome || {},
      expenseCats2 = data.categoryExpense || {};
    var allCats = {};
    Object.keys(incomeCats2).forEach(function (cat) {
      allCats[cat] = (allCats[cat] || 0) + incomeCats2[cat];
    });
    Object.keys(expenseCats2).forEach(function (cat) {
      allCats[cat] = (allCats[cat] || 0) - expenseCats2[cat];
    });
    var keys = Object.keys(allCats).sort(function (a, b) {
      return Math.abs(allCats[b]) - Math.abs(allCats[a]);
    });
    var hasData = false;
    keys.forEach(function (cat) {
      var val = allCats[cat];
      if (val !== 0) {
        hasData = true;
        var sign = val > 0 ? '+' : '-',
          color = val > 0 ? 'var(--secondary)' : 'var(--danger)';
        html += '<div class="detail-item"><span>' + cat + '</span><span style="color:' + color + ';">' + sign + Math.abs(val).toFixed(2) + ' ₽</span></div>';
      }
    });
    if (!hasData) {
      html = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет данных</div>';
    } else {
      html += '<div class="detail-item" style="font-weight:bold;border-top:2px solid var(--border-color);padding-top:12px;margin-top:8px;"><span>ИТОГО</span><span style="color:var(--primary);">' + data.balance.toFixed(2) + ' ₽</span></div>';
    }
  } else if (type === 'transactions') {
    title.textContent = '📊 Список транзакций';
    var txs = data.transactions || [];
    if (txs.length === 0) {
      html = '<div style="text-align:center;padding:20px;color:var(--text-secondary);">Нет транзакций</div>';
    } else {
      txs.forEach(function (t) {
        var sign = t.type === 'Доход' ? '+' : '-',
          color = t.type === 'Доход' ? 'var(--secondary)' : 'var(--danger)';
        html += '<div class="detail-item"><span>' + t.date + ' - ' + t.description + '</span><span style="color:' + color + ';">' + sign + Math.abs(t.amount).toFixed(2) + ' ₽</span></div>';
      });
      html += '<div class="detail-item" style="font-weight:bold;border-top:2px solid var(--border-color);padding-top:12px;margin-top:8px;"><span>ВСЕГО</span><span>' + txs.length + ' транзакций</span></div>';
    }
  }
  content.innerHTML = html;
  modal.classList.add('active');
}

// ============================================
// ТРАНЗАКЦИИ (CRUD)
// ============================================
function showAddModal() {
  document.getElementById('addModal').classList.add('active');
  document.getElementById('addModalTitle').textContent = '➕ Добавить транзакцию';
  document.getElementById('editId').value = '';
  document.getElementById('mDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('mAmt').value = '';
  document.getElementById('mDesc').value = '';
  document.getElementById('mType').value = 'Доход';
  document.getElementById('mError').style.display = 'none';
  document.getElementById('mSuccess').style.display = 'none';
  document.getElementById('mSubmitBtn').textContent = 'Сохранить';
  populateSelects(allData || {});
}

function closeModal() {
  document.getElementById('addModal').classList.remove('active');
}

function autoType() {
  var v = parseFloat(document.getElementById('mAmt').value);
  if (!isNaN(v)) {
    if (v < 0) document.getElementById('mType').value = 'Расход';
    else if (v > 0) document.getElementById('mType').value = 'Доход';
  }
}

function editTransaction(id) {
  var tx = allTx.find(function (t) {
    return t.id === id;
  });
  if (!tx) {
    showToast('Транзакция не найдена', 'Ошибка');
    return;
  }
  document.getElementById('addModal').classList.add('active');
  document.getElementById('addModalTitle').textContent = '✏️ Редактировать транзакцию';
  document.getElementById('editId').value = id;
  var dateParts = tx.date.split('.');
  if (dateParts.length === 3) document.getElementById('mDate').value = dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
  document.getElementById('mDesc').value = tx.description;
  document.getElementById('mAmt').value = Math.abs(tx.amount);
  document.getElementById('mType').value = tx.type;
  document.getElementById('mError').style.display = 'none';
  document.getElementById('mSuccess').style.display = 'none';
  document.getElementById('mSubmitBtn').textContent = 'Обновить';
  populateSelects(allData || {});
  setTimeout(function () {
    document.getElementById('mCat').value = tx.category || 'Без категории';
    document.getElementById('mAcc').value = tx.account || '';
    document.getElementById('mBank').value = tx.bank || '';
  }, 100);
}

function deleteTransaction(id) {
  if (!confirm('Удалить эту транзакцию?')) return;
  google.script.run.withSuccessHandler(function (result) {
    if (result.success) {
      showToast('Транзакция удалена', 'Успешно');
      refreshData();
    } else {
      showToast(result.error || 'Ошибка удаления', 'Ошибка');
    }
  }).withFailureHandler(function (err) {
    showToast('Ошибка: ' + err, 'Ошибка');
  }).deleteTransaction(id);
}

async function submitTx() {
  var id = document.getElementById('editId').value;
  var date = document.getElementById('mDate').value,
    desc = document.getElementById('mDesc').value.trim();
  var amt = document.getElementById('mAmt').value,
    type = document.getElementById('mType').value;
  var cat = document.getElementById('mCat').value,
    acc = document.getElementById('mAcc').value,
    bank = document.getElementById('mBank').value;
  if (!date || !desc || !amt) {
    document.getElementById('mError').style.display = 'block';
    document.getElementById('mError').textContent = 'Заполните все поля';
    return;
  }
  document.getElementById('mError').style.display = 'none';
  var final = parseFloat(amt);
  if (isNaN(final) || final === 0) {
    document.getElementById('mError').style.display = 'block';
    document.getElementById('mError').textContent = 'Введите корректную сумму (не 0)';
    return;
  }
  document.getElementById('mSuccess').style.display = 'none';
  var txData = { date: date, description: desc, amount: final, type: type, category: cat, account: acc, bank: bank, userId: currentUser.id };
  // Сначала пишем в Firebase (мгновенно)
  try {
    var docRef = await db.collection('transactions').add(txData);
    document.getElementById('mSuccess').style.display = 'block';
    document.getElementById('mSuccess').textContent = id ? '✅ Транзакция обновлена!' : '✅ Транзакция добавлена!';
    setTimeout(function () {
      closeModal();
      refreshData();
    }, 800);
  } catch (e) {
    document.getElementById('mError').style.display = 'block';
    document.getElementById('mError').textContent = 'Ошибка Firebase: ' + e.message;
    return;
  }
  // Затем отправляем в Sheets (в фоне)
  var action = id ? 'updateTransaction' : 'saveTransaction';
  var data = id ? [id, date, desc, final, type, cat, acc, bank] : [date, desc, final, type, cat, acc, bank];
  google.script.run.withSuccessHandler(function (result) {
    if (!result || !result.success) {
      console.warn('Sheets save failed:', result.error);
    }
  }).withFailureHandler(function (err) {
    console.warn('Sheets save error:', err);
  })[action].apply(null, data);
}

// ============================================
// ДОБАВЛЕНИЕ КАТЕГОРИИ
// ============================================
function showAddCategoryModal() {
  document.getElementById('addCategoryModal').classList.add('active');
  document.getElementById('newCatName').value = '';
  document.getElementById('newCatEmoji').value = '';
  document.getElementById('newCatType').value = 'Расход';
  document.getElementById('newCatSub').value = '';
  document.getElementById('catError').style.display = 'none';
  document.getElementById('catSuccess').style.display = 'none';
}

function closeAddCategoryModal() {
  document.getElementById('addCategoryModal').classList.remove('active');
}

function addCategory() {
  var name = document.getElementById('newCatName').value.trim();
  var emoji = document.getElementById('newCatEmoji').value.trim() || '📌';
  var type = document.getElementById('newCatType').value;
  var sub = document.getElementById('newCatSub').value.trim() || 'Разное';
  var errorEl = document.getElementById('catError'),
    successEl = document.getElementById('catSuccess');
  errorEl.style.display = 'none';
  successEl.style.display = 'none';
  if (!name) {
    errorEl.textContent = 'Введите название категории';
    errorEl.style.display = 'block';
    return;
  }
  google.script.run.withSuccessHandler(function (result) {
    if (result.success) {
      successEl.textContent = '✅ Категория добавлена!';
      successEl.style.display = 'block';
      setTimeout(function () {
        closeAddCategoryModal();
        refreshData();
      }, 1000);
    } else {
      errorEl.textContent = '❌ ' + (result.error || 'Ошибка добавления');
      errorEl.style.display = 'block';
    }
  }).withFailureHandler(function (err) {
    errorEl.textContent = 'Ошибка: ' + err;
    errorEl.style.display = 'block';
  }).addCategory(name, emoji, type, sub);
}

// ============================================
// ПРОФИЛЬ
// ============================================
function capitalizeFirst(input) {
  var val = input.value.replace(/[^а-яА-ЯёЁ]/g, '');
  if (val.length > 0) val = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
  input.value = val;
}

function openProfileModal() {
  var modal = document.getElementById('profileModal');
  modal.classList.add('active');
  var daySel = document.getElementById('pfDay'),
    monthSel = document.getElementById('pfMonth'),
    yearSel = document.getElementById('pfYear');
  daySel.innerHTML = '<option value="">ДД</option>';
  for (var d = 1; d <= 31; d++) {
    var opt = document.createElement('option');
    opt.value = d < 10 ? '0' + d : '' + d;
    opt.textContent = d < 10 ? '0' + d : '' + d;
    daySel.appendChild(opt);
  }
  var monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  monthSel.innerHTML = '<option value="">ММ</option>';
  monthNames.forEach(function (name, index) {
    var opt = document.createElement('option');
    opt.value = index + 1;
    opt.textContent = name;
    monthSel.appendChild(opt);
  });
  yearSel.innerHTML = '<option value="">ГГГГ</option>';
  var currentYear = new Date().getFullYear();
  for (var y = currentYear; y >= 1900; y--) {
    var opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSel.appendChild(opt);
  }
  google.script.run.withSuccessHandler(function (profile) {
    if (profile) {
      document.getElementById('pfSurname').value = profile.surname || '';
      document.getElementById('pfName').value = profile.name || '';
      document.getElementById('pfPatronymic').value = profile.patronymic || '';
      var phoneVal = profile.phone ? profile.phone.replace('+7', '') : '';
      document.getElementById('pfPhone').value = phoneVal;
      if (profile.birthdate) {
        var parts = profile.birthdate.split('.');
        if (parts.length === 3) {
          document.getElementById('pfDay').value = parts[0];
          document.getElementById('pfMonth').value = parts[1];
          document.getElementById('pfYear').value = parts[2];
        }
      }
      document.getElementById('pfSaveBtn').style.display = 'none';
      document.getElementById('pfEditBtn').style.display = 'inline-block';
      document.getElementById('pfSuccess').style.display = 'none';
      document.querySelectorAll('#profileModal input, #profileModal select').forEach(function (el) {
        el.disabled = true;
      });
    } else {
      document.getElementById('pfSaveBtn').style.display = 'inline-block';
      document.getElementById('pfEditBtn').style.display = 'none';
      document.querySelectorAll('#profileModal input, #profileModal select').forEach(function (el) {
        el.disabled = false;
      });
    }
  }).withFailureHandler(function (err) {
    showToast('Ошибка загрузки данных: ' + err, 'Ошибка');
  }).getProfile(currentUser ? currentUser.login : '');
}

function closeProfileModal() {
  document.getElementById('profileModal').classList.remove('active');
}

function editProfile() {
  document.querySelectorAll('#profileModal input, #profileModal select').forEach(function (el) {
    el.disabled = false;
  });
  document.getElementById('pfSaveBtn').style.display = 'inline-block';
  document.getElementById('pfEditBtn').style.display = 'none';
  document.getElementById('pfSuccess').style.display = 'none';
}

function saveProfile() {
  var surname = document.getElementById('pfSurname').value.trim();
  var name = document.getElementById('pfName').value.trim();
  var patronymic = document.getElementById('pfPatronymic').value.trim();
  var phone = document.getElementById('pfPhone').value.trim();
  var day = document.getElementById('pfDay').value,
    month = document.getElementById('pfMonth').value,
    year = document.getElementById('pfYear').value;
  var errorEl = document.getElementById('pfError'),
    successEl = document.getElementById('pfSuccess');
  errorEl.style.display = 'none';
  successEl.style.display = 'none';
  if (!surname || !name) {
    errorEl.textContent = 'Введите Фамилию и Имя';
    errorEl.style.display = 'block';
    return;
  }
  if (phone && phone.length !== 10) {
    errorEl.textContent = 'Телефон должен содержать ровно 10 цифр';
    errorEl.style.display = 'block';
    return;
  }
  var birthdate = '';
  if (day && month && year) birthdate = day + '.' + month + '.' + year;
  google.script.run.withSuccessHandler(function (result) {
    if (result.success) {
      successEl.textContent = '✅ Данные сохранены!';
      successEl.style.display = 'block';
      document.querySelectorAll('#profileModal input, #profileModal select').forEach(function (el) {
        el.disabled = true;
      });
      document.getElementById('pfSaveBtn').style.display = 'none';
      document.getElementById('pfEditBtn').style.display = 'inline-block';
      if (result.profile) {
        localStorage.setItem('luminous_user_profile', JSON.stringify(result.profile));
      }
      updateUserDisplay();
      showToast('Данные профиля сохранены', 'Успешно');
      setTimeout(function () {
        closeProfileModal();
      }, 1500);
    } else {
      errorEl.textContent = '❌ ' + (result.error || 'Ошибка сохранения');
      errorEl.style.display = 'block';
    }
  }).withFailureHandler(function (err) {
    errorEl.textContent = 'Ошибка: ' + err;
    errorEl.style.display = 'block';
  }).saveProfile(currentUser ? currentUser.login : '', surname, name, patronymic, phone, birthdate);
}

// ============================================
// КОНСТРУКТОР ГРАФИКОВ
// ============================================
function buildChart() {
  if (!allData) {
    showToast('Сначала загрузите данные', 'Ошибка');
    return;
  }
  var type = document.getElementById('builderChartType').value;
  var x = document.getElementById('builderDataX').value;
  var y = document.getElementById('builderDataY').value;
  var period = document.getElementById('builderPeriod').value;
  var colorScheme = document.getElementById('builderColorScheme').value;
  var showLabels = document.getElementById('builderShowLabels').checked;
  var smooth = document.getElementById('builderSmooth').checked;
  var stacked = document.getElementById('builderStacked').checked;
  var animate = document.getElementById('builderAnimate').checked;
  var ctx = document.getElementById('builderChart').getContext('2d');
  if (builderChart) builderChart.destroy();
  var labels = [],
    datasets = [];
  var colors = getColorScheme(colorScheme);
  if (x === 'month') labels = allData.monthLabels || [];
  else if (x === 'category') labels = allData.categoryLabels || [];
  else if (x === 'bank') labels = allData.bankLabels || [];
  else if (x === 'year') labels = Object.keys(allData.yearlyData || {}).sort();
  else if (x === 'day') labels = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  function getYData(yType) {
    if (x === 'month') {
      if (yType === 'income') return allData.monthIncome || [];
      if (yType === 'expense') return allData.monthExpense || [];
      if (yType === 'balance') return allData.monthDelta || [];
    } else if (x === 'category') {
      if (yType === 'income') return Object.values(allData.categoryIncome || {});
      if (yType === 'expense') return Object.values(allData.categoryExpense || {});
      if (yType === 'balance') return Object.values(allData.categoryIncome || {}).map((v, i) => v - (Object.values(allData.categoryExpense || {})[i] || 0));
    } else if (x === 'bank') {
      if (yType === 'income') return allData.bankIncomeData || [];
      if (yType === 'expense') return allData.bankExpenseData || [];
      if (yType === 'balance') return allData.bankIncomeData.map((v, i) => v - (allData.bankExpenseData[i] || 0));
    } else if (x === 'year') {
      var years = Object.keys(allData.yearlyData || {}).sort();
      if (yType === 'income') return years.map(y => allData.yearlyData[y].income || 0);
      if (yType === 'expense') return years.map(y => allData.yearlyData[y].expense || 0);
      if (yType === 'balance') return years.map(y => (allData.yearlyData[y].income || 0) - (allData.yearlyData[y].expense || 0));
    } else if (x === 'day') {
      var dayData = [0, 0, 0, 0, 0, 0, 0];
      (allData.transactions || []).forEach(function (t) {
        if (t.type === 'Расход') {
          var parts = t.date.split('.');
          if (parts.length === 3) {
            var dt = new Date(parts[2], parts[1] - 1, parts[0]);
            var day = dt.getDay();
            dayData[day === 0 ? 6 : day - 1] += Math.abs(t.amount);
          }
        }
      });
      return dayData;
    }
    return [];
  }
  if (y === 'income') {
    datasets.push({ label: 'Доходы', data: getYData('income'), backgroundColor: colors[0], borderColor: darken(colors[0]), borderWidth: 2 });
  } else if (y === 'expense') {
    datasets.push({ label: 'Расходы', data: getYData('expense'), backgroundColor: colors[1], borderColor: darken(colors[1]), borderWidth: 2 });
  } else if (y === 'both') {
    datasets.push({ label: 'Доходы', data: getYData('income'), backgroundColor: colors[0], borderColor: darken(colors[0]), borderWidth: 2 });
    datasets.push({ label: 'Расходы', data: getYData('expense'), backgroundColor: colors[1], borderColor: darken(colors[1]), borderWidth: 2 });
  } else if (y === 'balance') {
    datasets.push({ label: 'Баланс', data: getYData('balance'), backgroundColor: colors[2], borderColor: darken(colors[2]), borderWidth: 2 });
  }
  var chartType = type;
  if (type === 'barStacked') { chartType = 'bar';
    stacked = true; }
  if (type === 'lineStacked') { chartType = 'line';
    stacked = true; }
  if (['pie', 'doughnut', 'polarArea'].includes(chartType)) {
    if (datasets.length > 1) {
      var combined = datasets[0].data.map(function (v, i) {
        return v + (datasets[1] ? datasets[1].data[i] || 0 : 0);
      });
      datasets = [{ label: 'Всего', data: combined, backgroundColor: colors.slice(0, combined.length), borderColor: colors.slice(0, combined.length) }];
    }
    var bgColors = [];
    for (var i = 0; i < (datasets[0] ? datasets[0].data.length : 0); i++) {
      bgColors.push(colors[i % colors.length]);
    }
    if (datasets[0]) datasets[0].backgroundColor = bgColors;
  }
  if (chartType === 'scatter' || chartType === 'bubble') {
    var scatterData = [];
    var labelsX = labels;
    var yData = datasets[0] ? datasets[0].data : [];
    for (var i = 0; i < labelsX.length; i++) {
      var point = { x: labelsX[i], y: yData[i] || 0 };
      if (chartType === 'bubble') {
        point.r = Math.abs(yData[i] || 0) / 100 + 5;
      }
      scatterData.push(point);
    }
    datasets = [{ label: datasets[0] ? datasets[0].label : 'Данные', data: scatterData, backgroundColor: colors[0], borderColor: darken(colors[0]), borderWidth: 1 }];
  }
  var options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: getComputedStyle(document.body).getPropertyValue('--text-primary').trim() || '#e0e0e0',
          font: { size: 12 }
        }
      }
    },
    scales: {},
    animation: animate ? { duration: 1000 } : false
  };
  if (['bar', 'line', 'barStacked', 'lineStacked'].includes(chartType)) {
    options.scales = {
      y: {
        ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#8b8ba3' },
        grid: { color: getComputedStyle(document.body).getPropertyValue('--border-color').trim() || 'rgba(255,255,255,0.05)' },
        beginAtZero: true,
        stacked: stacked
      },
      x: {
        ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#8b8ba3', maxRotation: 45 },
        grid: { color: getComputedStyle(document.body).getPropertyValue('--border-color').trim() || 'rgba(255,255,255,0.05)' },
        stacked: stacked
      }
    };
    if (chartType === 'line' || chartType === 'lineStacked') {
      options.elements = { line: { tension: smooth ? 0.4 : 0 } };
    }
  }
  if (chartType === 'scatter' || chartType === 'bubble') {
    options.scales = {
      y: {
        ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#8b8ba3' },
        grid: { color: getComputedStyle(document.body).getPropertyValue('--border-color').trim() || 'rgba(255,255,255,0.05)' },
        beginAtZero: true
      },
      x: {
        ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary').trim() || '#8b8ba3', maxRotation: 45 },
        grid: { color: getComputedStyle(document.body).getPropertyValue('--border-color').trim() || 'rgba(255,255,255,0.05)' }
      }
    };
  }
  if (showLabels && chartType !== 'scatter' && chartType !== 'bubble') {
    options.plugins.datalabels = {
      color: getComputedStyle(document.body).getPropertyValue('--text-primary').trim() || '#e0e0e0',
      font: { size: 9 },
      anchor: 'end',
      align: 'end'
    };
  }
  builderChart = new Chart(ctx, {
    type: chartType,
    data: { labels: labels, datasets: datasets },
    options: options
  });
  updateBuilderStats(datasets);
}

function getColorScheme(scheme) {
  var schemes = {
    'default': ['rgba(0,212,170,0.7)', 'rgba(255,107,107,0.7)', 'rgba(108,92,231,0.7)', 'rgba(251,191,36,0.7)', 'rgba(96,165,250,0.7)', 'rgba(244,114,182,0.7)'],
    'pastel': ['rgba(186,230,211,0.7)', 'rgba(254,202,202,0.7)', 'rgba(196,181,253,0.7)', 'rgba(252,211,77,0.7)', 'rgba(147,197,253,0.7)', 'rgba(244,114,182,0.7)'],
    'vibrant': ['rgba(0,200,150,0.8)', 'rgba(255,80,80,0.8)', 'rgba(100,80,255,0.8)', 'rgba(255,180,0,0.8)', 'rgba(0,180,255,0.8)', 'rgba(255,0,150,0.8)'],
    'dark': ['rgba(0,180,140,0.8)', 'rgba(200,80,80,0.8)', 'rgba(80,70,200,0.8)', 'rgba(200,150,0,0.8)', 'rgba(0,150,200,0.8)', 'rgba(200,0,120,0.8)']
  };
  return schemes[scheme] || schemes['default'];
}

function darken(color) {
  return color.replace('0.7', '1').replace('0.8', '1');
}

function updateBuilderStats(datasets) {
  var container = document.getElementById('builderStats');
  if (!container) return;
  if (!datasets || datasets.length === 0) {
    container.innerHTML = '';
    return;
  }
  var total = 0,
    max = 0,
    min = Infinity;
  datasets.forEach(function (ds) {
    ds.data.forEach(function (v) {
      total += v;
      if (v > max) max = v;
      if (v < min) min = v;
    });
  });
  var html = '';
  html += '<div class="kpi-card" style="padding:8px;"><div class="label">📊 Всего</div><div class="value">' + total.toFixed(2) + '</div></div>';
  html += '<div class="kpi-card" style="padding:8px;"><div class="label">📈 Максимум</div><div class="value">' + max.toFixed(2) + '</div></div>';
  html += '<div class="kpi-card" style="padding:8px;"><div class="label">📉 Минимум</div><div class="value">' + (min === Infinity ? '0' : min.toFixed(2)) + '</div></div>';
  html += '<div class="kpi-card" style="padding:8px;"><div class="label">📊 Кол-во</div><div class="value">' + (datasets[0] ? datasets[0].data.length : 0) + '</div></div>';
  container.innerHTML = html;
}

function exportBuilderChart() {
  var canvas = document.getElementById('builderChart');
  if (!canvas) {
    showToast('Сначала постройте график', 'Ошибка');
    return;
  }
  var link = document.createElement('a');
  link.download = 'график_' + new Date().toISOString().slice(0, 10) + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('✅ График экспортирован!', 'Успешно');
}

// ============================================
// ВЫХОД
// ============================================
function logout() {
  localStorage.removeItem('luminous_session');
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('appContainer').style.display = 'none';
  document.getElementById('passwordInput').value = '';
  document.getElementById('loginInput').value = '';
  document.getElementById('loginError').style.display = 'none';
  allTx = [];
  allData = null;
  currentUser = null;
  document.getElementById('userFullName').textContent = 'Пользователь';
  document.getElementById('userPhone').textContent = '+7';
  document.getElementById('userRoleDisplay').style.display = 'none';
  if (chartCat) { chartCat.destroy();
    chartCat = null; }
  if (chartBank) { chartBank.destroy();
    chartBank = null; }
  if (chartTrend) { chartTrend.destroy();
    chartTrend = null; }
  if (chartMonthly) { chartMonthly.destroy();
    chartMonthly = null; }
  if (chartHeatmap) { chartHeatmap.destroy();
    chartHeatmap = null; }
  if (chartWeeklyTrend) { chartWeeklyTrend.destroy();
    chartWeeklyTrend = null; }
  if (chartCategoryCompare) { chartCategoryCompare.destroy();
    chartCategoryCompare = null; }
  if (chartCumulative) { chartCumulative.destroy();
    chartCumulative = null; }
  if (builderChart) { builderChart.destroy();
    builderChart = null; }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================
window.onload = function () {
  loadTheme();
  var mobileMode = localStorage.getItem('luminous_mobile');
  if (mobileMode === 'mobile') {
    document.body.classList.add('mobile-mode');
    document.getElementById('toggleMobileBtn').textContent = '💻 Десктоп';
  } else if (window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.body.classList.add('mobile-mode');
    document.getElementById('toggleMobileBtn').textContent = '💻 Десктоп';
  } else {
    document.body.classList.remove('mobile-mode');
    document.getElementById('toggleMobileBtn').textContent = '📱 Мобильная';
  }
  var compact = localStorage.getItem('luminous_compact');
  if (compact === 'true') {
    compactMode = true;
    document.body.classList.add('compact-mode');
    document.getElementById('compactToggleBtn').textContent = '📐 Расширенный';
  }
  var session = localStorage.getItem('luminous_session');
  if (session) {
    try {
      var data = JSON.parse(session);
      if (data.user && data.timestamp && (Date.now() - data.timestamp < 15 * 60 * 1000)) {
        currentUser = data.user;
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('appContainer').style.display = 'flex';
        updateUserDisplay();
        refreshData();
        resetSessionTimer();
        if (currentUser.role === 'Администратор') {
          document.getElementById('adminPanel').style.display = 'flex';
        }
      } else {
        localStorage.removeItem('luminous_session');
        document.getElementById('loginInput').focus();
      }
    } catch (e) {
      localStorage.removeItem('luminous_session');
      document.getElementById('loginInput').focus();
    }
  } else {
    document.getElementById('loginInput').focus();
  }
  initFilters();
  initDesignerResize();
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    if (document.getElementById('addModal').classList.contains('active')) {
      var id = document.getElementById('editId').value;
      if (id) {
        var amt = document.getElementById('mAmt').value;
        if (amt && parseFloat(amt) !== 0) submitTx();
      } else {
        var date = document.getElementById('mDate').value;
        var desc = document.getElementById('mDesc').value.trim();
        var amt2 = document.getElementById('mAmt').value;
        if (date && desc && amt2 && parseFloat(amt2) !== 0) submitTx();
      }
      return;
    }
    if (document.getElementById('profileModal').classList.contains('active')) {
      var surname = document.getElementById('pfSurname').value.trim();
      var name = document.getElementById('pfName').value.trim();
      if (surname && name) saveProfile();
      return;
    }
    if (document.getElementById('forgotModal').classList.contains('active')) {
      var newPass = document.getElementById('forgotNewPassword').value;
      if (newPass && newPass.length >= 4) resetForgotPassword();
      else if (document.getElementById('forgotNewPasswordSection').style.display !== 'none') checkForgotPhone();
      return;
    }
    if (document.getElementById('addCategoryModal').classList.contains('active')) {
      var catName = document.getElementById('newCatName').value.trim();
      if (catName) addCategory();
      return;
    }
    if (document.getElementById('editCategoryModal').classList.contains('active')) {
      var editCatName = document.getElementById('editCatName').value.trim();
      if (editCatName) updateCategory();
      return;
    }
    if (document.getElementById('modalDesigner').classList.contains('active')) {
      var desName = document.getElementById('designerName').value.trim();
      if (desName) saveDesignerSettings();
      return;
    }
    if (!document.getElementById('loginScreen').classList.contains('hidden')) {
      var login = document.getElementById('loginInput').value.trim();
      var password = document.getElementById('passwordInput').value;
      if (login && password) checkLogin();
      return;
    }
    if (document.getElementById('registerForm').style.display !== 'none') {
      var regLogin = document.getElementById('regLogin').value.trim();
      var regPass = document.getElementById('regPassword').value;
      var regPhone = document.getElementById('regPhone').value.trim();
      if (regLogin && regPass && regPhone && regPhone.length === 10) register();
      else if (regLogin && regPass) document.getElementById('regPhone').focus();
      else if (regLogin) document.getElementById('regPassword').focus();
      else document.getElementById('regLogin').focus();
      return;
    }
  });
};
