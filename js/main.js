document.addEventListener('DOMContentLoaded', () => {
    // --- 1. تعريف المتغيرات والعناصر ---
    const screens = document.querySelectorAll('.screen');
    const navButtons = document.querySelectorAll('.nav-btn');
    const mainInput = document.getElementById('main-input');
    const commandButtons = document.querySelectorAll('.command-btn');
    const searchEngineSelect = document.getElementById('search-engine');
    const previewExplanation = document.getElementById('preview-explanation');
    const finalUrlInput = document.getElementById('final-url');
    const copyUrlBtn = document.getElementById('copy-url-btn');
    const searchNowBtn = document.getElementById('search-now-btn');
    const resetQueryBtn = document.getElementById('reset-query-btn');
    const addToFavoritesBtn = document.getElementById('add-to-favorites-btn');
    const langSelect = document.getElementById('lang-select');

    // عناصر Modal الأوامر
    const commandModal = document.getElementById('command-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalInput = document.getElementById('modal-input');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    const modalPredefinedChoices = document.getElementById('modal-predefined-choices');
    
    // عناصر Modal المفضلة
    const favoriteNameModal = document.getElementById('favorite-name-modal');
    const favoriteNameInput = document.getElementById('favorite-name-input');
    const saveFavoriteBtn = document.getElementById('save-favorite-btn');

    // عناصر القوائم والإعدادات
    const closeBtns = document.querySelectorAll('.close-btn');
    const historyList = document.getElementById('history-list');
    const favoritesList = document.getElementById('favorites-list');
    const toggleThemeBtn = document.getElementById('toggle-theme-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const exportJsonBtn = document.getElementById('export-json-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    
    // متغيرات الحالة
    let queryState = { keywords: '', site: '', filetype: '', exclude: '', exact: '', intitle: '' };
    let currentCommand = '';

    // --- 2. نظام تغيير اللغة (Internationalization) ---
    const locales = {
        ar: {
            appTitle: "مساعد البحث الأكاديمي", navMain: "الرئيسية", navHistory: "السجلّ", navFavorites: "المفضلة", navSettings: "الإعدادات",
            searchEngineLabel: "اختر محرك البحث:", mainInputPlaceholder: "اكتب الكلمات المفتاحية الأساسية هنا...",
            cmdSite: "البحث داخل موقع", cmdFiletype: "تحديد نوع الملف", cmdExclude: "استبعاد كلمة", cmdExact: "بحث مطابق", cmdIntitle: "كلمة في العنوان",
            queryPreviewTitle: "الاستعلام النهائي:", queryPreviewPlaceholder: "لم تقم بتكوين أي استعلام بعد.",
            finalUrlTitle: "رابط البحث:", copyBtn: "نسخ", searchNowBtn: "ابحث الآن", addToFavoritesBtn: "أضف للمفضلة", resetQueryBtn: "إعادة تعيين",
            historyTitle: "سجلّ البحث", favoritesTitle: "الاستعلامات المفضلة", settingsTitle: "الإعدادات",
            themeSetting: "تغيير الثيم", toggleThemeBtnDark: "التبديل إلى الوضع المظلم", toggleThemeBtnLight: "التبديل إلى الوضع الفاتح",
            clearHistorySetting: "مسح سجل البحث", clearHistoryBtn: "مسح السجلّ",
            exportDataSetting: "تصدير البيانات", exportJsonBtn: "تصدير إلى JSON", exportCsvBtn: "تصدير إلى CSV",
            saveBtn: "حفظ", saveToFavoritesTitle: "حفظ في المفضلة", favoriteNamePlaceholder: "أدخل اسمًا للاستعلام...",
            historyEmpty: "لا يوجد أي سجل بحث حتى الآن.", favoritesEmpty: "لا توجد أي استعلامات محفوظة في المفضلة.",
            confirmDelete: "هل أنت متأكد من حذف هذا العنصر؟", confirmClearHistory: "تحذير: سيتم حذف جميع سجلات البحث بشكل نهائي. هل أنت متأكد؟",
            urlCopied: "تم نسخ الرابط!", queryEmpty: "يرجى إدخال كلمات مفتاحية أولاً.", favoriteNameMissing: "يرجى إدخال اسم للاستعلام.",
            reSearch: "إعادة البحث", copy: "نسخ", delete: "حذف", apply: "تطبيق", engineLabel: "محرك البحث",
        },
        en: {
            appTitle: "Academic Search Helper", navMain: "Home", navHistory: "History", navFavorites: "Favorites", navSettings: "Settings",
            searchEngineLabel: "Select Search Engine:", mainInputPlaceholder: "Type primary keywords here...",
            cmdSite: "Search within a site", cmdFiletype: "Specify file type", cmdExclude: "Exclude a word", cmdExact: "Exact phrase", cmdIntitle: "Word in title",
            queryPreviewTitle: "Final Query:", queryPreviewPlaceholder: "You have not built a query yet.",
            finalUrlTitle: "Search URL:", copyBtn: "Copy", searchNowBtn: "Search Now", addToFavoritesBtn: "Add to Favorites", resetQueryBtn: "Reset",
            historyTitle: "Search History", favoritesTitle: "Favorite Queries", settingsTitle: "Settings",
            themeSetting: "Change Theme", toggleThemeBtnDark: "Switch to Dark Mode", toggleThemeBtnLight: "Switch to Light Mode",
            clearHistorySetting: "Clear Search History", clearHistoryBtn: "Clear History",
            exportDataSetting: "Export Data", exportJsonBtn: "Export to JSON", exportCsvBtn: "Export to CSV",
            saveBtn: "Save", saveToFavoritesTitle: "Save to Favorites", favoriteNamePlaceholder: "Enter a name for the query...",
            historyEmpty: "No search history yet.", favoritesEmpty: "No favorite queries saved yet.",
            confirmDelete: "Are you sure you want to delete this item?", confirmClearHistory: "Warning: This will permanently delete your entire search history. Are you sure?",
            urlCopied: "URL copied to clipboard!", queryEmpty: "Please enter keywords first.", favoriteNameMissing: "Please enter a name for the query.",
            reSearch: "Re-search", copy: "Copy", delete: "Delete", apply: "Apply", engineLabel: "Engine",
        }
    };

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.body.classList.remove('lang-ar', 'lang-en');
        document.body.classList.add(`lang-${lang}`);
        localStorage.setItem('language', lang);
        langSelect.value = lang;

        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (key === 'toggleThemeBtnKey') return;
            const translation = locales[lang][key];
            if (translation) {
                if (el.placeholder) el.placeholder = translation;
                else el.textContent = translation;
            }
        });
        updateThemeButtonText();
        updateQueryPreviewAndUrl();
    };

    const deviceId = (() => {
        let id = localStorage.getItem('deviceId');
        if (!id) { id = 'web-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9); localStorage.setItem('deviceId', id); }
        return id;
    })();

    const updateQueryPreviewAndUrl = () => {
        queryState.keywords = mainInput.value.trim();
        const lang = localStorage.getItem('language') || 'ar';
        let queryParts = [];

        if (queryState.keywords) queryParts.push(queryState.keywords);
        if (queryState.exact) queryParts.push(`"${queryState.exact}"`);
        if (queryState.site) queryParts.push(`site:${queryState.site}`);
        if (queryState.filetype) queryParts.push(`filetype:${queryState.filetype}`);
        if (queryState.exclude) queryParts.push(`-${queryState.exclude}`);
        if (queryState.intitle) queryParts.push(`intitle:"${queryState.intitle}"`);
        
        const fullQuery = queryParts.join(' ');
        previewExplanation.textContent = fullQuery || locales[lang].queryPreviewPlaceholder;
        finalUrlInput.value = fullQuery ? (searchEngineSelect.value + encodeURIComponent(fullQuery)) : '';
    };

    const openModal = (type) => {
        currentCommand = type;
        const lang = localStorage.getItem('language') || 'ar';
        const keyMap = { site: 'cmdSite', filetype: 'cmdFiletype', exclude: 'cmdExclude', exact: 'cmdExact', intitle: 'cmdIntitle' };
        modalTitle.textContent = locales[lang][keyMap[type]];
        modalInput.value = queryState[type] || '';

        const predefinedChoices = { filetype: ['pdf', 'docx', 'pptx', 'xlsx', 'csv'] };
        modalPredefinedChoices.innerHTML = '';
        if (predefinedChoices[type]) {
            predefinedChoices[type].forEach(choice => {
                const btn = document.createElement('button');
                btn.className = 'predefined-choice-btn';
                btn.textContent = choice;
                btn.onclick = () => { modalInput.value = choice; modalSaveBtn.click(); };
                modalPredefinedChoices.appendChild(btn);
            });
        }
        commandModal.style.display = 'flex';
        modalInput.focus();
    };
    
    const closeModal = () => { commandModal.style.display = 'none'; favoriteNameModal.style.display = 'none'; };
    const applyTheme = (theme) => { document.body.classList.toggle('dark-theme', theme === 'dark'); document.body.classList.toggle('light-theme', theme !== 'dark'); localStorage.setItem('theme', theme); updateThemeButtonText(); };
    const updateThemeButtonText = () => { const lang = localStorage.getItem('language') || 'ar'; const theme = localStorage.getItem('theme') || 'light'; toggleThemeBtn.textContent = (theme === 'light') ? locales[lang].toggleThemeBtnDark : locales[lang].toggleThemeBtnLight; };

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetScreenId = button.id.replace('nav-', '') + '-screen';
            screens.forEach(screen => screen.classList.remove('active'));
            document.getElementById(targetScreenId).classList.add('active');
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            if (targetScreenId === 'history-screen') loadHistory();
            if (targetScreenId === 'favorites-screen') loadFavorites();
        });
    });

    [mainInput, searchEngineSelect].forEach(el => el.addEventListener('input', updateQueryPreviewAndUrl));
    commandButtons.forEach(button => button.addEventListener('click', () => openModal(button.dataset.command)));
    modalSaveBtn.addEventListener('click', () => { queryState[currentCommand] = modalInput.value.trim(); updateQueryPreviewAndUrl(); closeModal(); });
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    window.addEventListener('click', (e) => { if (e.target === commandModal || e.target === favoriteNameModal) closeModal(); });

    copyUrlBtn.addEventListener('click', () => { if(!finalUrlInput.value) return; finalUrlInput.select(); document.execCommand('copy'); alert(locales[localStorage.getItem('language') || 'ar'].urlCopied); });
    resetQueryBtn.addEventListener('click', () => { queryState = { keywords: '', site: '', filetype: '', exclude: '', exact: '', intitle: '' }; mainInput.value = ''; updateQueryPreviewAndUrl(); });
    searchNowBtn.addEventListener('click', () => { if (!finalUrlInput.value || !queryState.keywords) { alert(locales[localStorage.getItem('language') || 'ar'].queryEmpty); return; } window.open(finalUrlInput.value, '_blank'); saveToHistory(); });
    toggleThemeBtn.addEventListener('click', () => { const currentTheme = localStorage.getItem('theme') || 'light'; applyTheme(currentTheme === 'light' ? 'dark' : 'light'); });
    langSelect.addEventListener('change', () => setLanguage(langSelect.value));

    const saveToHistory = async () => { try { await db.collection('Searches').add({ deviceId: deviceId, queryData: queryState, queryText: previewExplanation.textContent, engine: searchEngineSelect.options[searchEngineSelect.selectedIndex].dataset.name, url: finalUrlInput.value, createdAt: firebase.firestore.FieldValue.serverTimestamp() }); } catch (error) { console.error("Error saving to history: ", error); } };
    
    const renderList = (element, collectionName, docs, emptyKey, renderer) => { 
        const lang = localStorage.getItem('language') || 'ar'; 
        if (docs.empty) { element.innerHTML = `<div class="card">${locales[lang][emptyKey]}</div>`; return; } 
        element.innerHTML = ''; 
        docs.forEach(doc => renderer(doc, lang)); 
    };
    
    const loadHistory = async () => { 
        const snapshot = await db.collection('Searches').where('deviceId', '==', deviceId).orderBy('createdAt', 'desc').limit(30).get(); 
        renderList(historyList, 'Searches', snapshot, 'historyEmpty', (doc, lang) => { 
            const data = doc.data(); 
            const date = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString(lang) : ''; 
            const item = document.createElement('div'); 
            item.className = 'list-item card'; 
            item.innerHTML = `<h4>${data.queryData.keywords}</h4> <p class="query-text">${data.queryText}</p> <p class="meta-info">${locales[lang].engineLabel}: ${data.engine} | ${date}</p> <div class="item-actions"> <button onclick="window.open('${data.url}', '_blank')">${locales[lang].reSearch}</button> <button class="delete-item" data-collection="Searches" data-id="${doc.id}">${locales[lang].delete}</button> </div>`; 
            historyList.appendChild(item); 
        }); 
    };
    
    const loadFavorites = async () => { 
        const snapshot = await db.collection('Favorites').where('deviceId', '==', deviceId).orderBy('createdAt', 'desc').get(); 
        renderList(favoritesList, 'Favorites', snapshot, 'favoritesEmpty', (doc, lang) => { 
            const data = doc.data(); 
            const item = document.createElement('div'); 
            item.className = 'list-item card'; 
            item.innerHTML = `<h4>${data.queryName}</h4> <p class="meta-info">${locales[lang].engineLabel}: ${data.engine}</p> <div class="item-actions"> <button class="apply-favorite" data-id="${doc.id}">${locales[lang].apply}</button> <button class="delete-item" data-collection="Favorites" data-id="${doc.id}">${locales[lang].delete}</button> </div>`; 
            favoritesList.appendChild(item); 
        }); 
    };

    addToFavoritesBtn.addEventListener('click', () => { if (!queryState.keywords) { alert(locales[localStorage.getItem('language') || 'ar'].queryEmpty); return; } favoriteNameModal.style.display = 'flex'; favoriteNameInput.focus(); });
    
    saveFavoriteBtn.addEventListener('click', async () => { 
        const name = favoriteNameInput.value.trim(); 
        if (!name) { alert(locales[localStorage.getItem('language') || 'ar'].favoriteNameMissing); return; } 
        await db.collection('Favorites').add({ deviceId: deviceId, queryName: name, queryData: queryState, engine: searchEngineSelect.options[searchEngineSelect.selectedIndex].dataset.name, engineValue: searchEngineSelect.value, createdAt: firebase.firestore.FieldValue.serverTimestamp() }); 
        favoriteNameInput.value = ''; 
        closeModal(); 
        if(favoritesList.parentElement.parentElement.classList.contains('active')) loadFavorites(); 
    });
    
    clearHistoryBtn.addEventListener('click', async () => { 
        if (confirm(locales[localStorage.getItem('language') || 'ar'].confirmClearHistory)) { 
            const snapshot = await db.collection('Searches').where('deviceId', '==', deviceId).get(); 
            const batch = db.batch(); 
            snapshot.forEach(doc => batch.delete(doc.ref)); 
            await batch.commit(); 
            loadHistory(); 
        } 
    });

    document.addEventListener('click', async (e) => {
        const lang = localStorage.getItem('language') || 'ar';
        if (e.target.closest('.delete-item')) { 
            const button = e.target.closest('.delete-item');
            if (confirm(locales[lang].confirmDelete)) { 
                const { collection, id } = button.dataset; 
                await db.collection(collection).doc(id).delete(); 
                if (collection === 'Searches') loadHistory(); 
                else loadFavorites(); 
            } 
        }
        if (e.target.closest('.apply-favorite')) { 
            const button = e.target.closest('.apply-favorite');
            const doc = await db.collection('Favorites').doc(button.dataset.id).get(); 
            if (doc.exists) { 
                const data = doc.data(); 
                queryState = data.queryData; 
                mainInput.value = queryState.keywords || ''; 
                searchEngineSelect.value = data.engineValue; 
                updateQueryPreviewAndUrl(); 
                document.getElementById('nav-main').click(); 
            } 
        }
    });
    
    const downloadFile = (data, filename, type) => { 
        const blob = new Blob([data], { type }); 
        const link = document.createElement('a'); 
        link.href = URL.createObjectURL(blob); 
        link.download = filename; 
        document.body.appendChild(link);
        link.click(); 
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href); 
    };

    exportJsonBtn.addEventListener('click', async () => { 
        const historySnapshot = await db.collection('Searches').where('deviceId', '==', deviceId).get();
        const favoritesSnapshot = await db.collection('Favorites').where('deviceId', '==', deviceId).get();
        const history = historySnapshot.docs.map(doc => doc.data());
        const favorites = favoritesSnapshot.docs.map(doc => doc.data());
        downloadFile(JSON.stringify({ history, favorites }, null, 2), 'academic_search_data.json', 'application/json'); 
    });

    exportCsvBtn.addEventListener('click', async () => { 
        const snapshot = await db.collection('Searches').where('deviceId', '==', deviceId).get(); 
        let csv = "Keywords,QueryText,Engine,URL,CreatedAt\n"; 
        snapshot.forEach(doc => { 
            const d = doc.data(); 
            const row = [
                `"${(d.queryData.keywords || '').replace(/"/g, '""')}"`, 
                `"${d.queryText.replace(/"/g, '""')}"`, 
                d.engine, 
                d.url, 
                d.createdAt ? new Date(d.createdAt.seconds * 1000).toISOString() : ''
            ].join(','); 
            csv += row + "\n"; 
        }); 
        downloadFile(csv, 'search_history.csv', 'text/csv;charset=utf-8;'); 
    });

    const initialLang = localStorage.getItem('language') || 'ar';
    setLanguage(initialLang);
    const initialTheme = localStorage.getItem('theme') || 'light';
    applyTheme(initialTheme);
});