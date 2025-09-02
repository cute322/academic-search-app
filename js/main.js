document.addEventListener('DOMContentLoaded', () => {
    // --- 1. تعريف المتغيرات والعناصر ---
    const mainInputHeader = document.getElementById('main-input-header');
    const searchBtnHeader = document.querySelector('.search-btn-header');
    const mainInput = document.getElementById('main-input');
    const searchNowBtn = document.getElementById('search-now-btn');
    const sourceChips = document.querySelectorAll('.source-chips input[type="checkbox"]');
    const selectAllSourcesBtn = document.getElementById('select-all-sources');
    const clearAllSourcesBtn = document.getElementById('clear-all-sources');
    const filetypeFilter = document.getElementById('filetype-filter');
    const domainFilter = document.getElementById('domain-filter');
    const yearFilter = document.getElementById('year-filter');
    const languageFilter = document.getElementById('language-filter');
    const excludeFilter = document.getElementById('exclude-filter');
    const previewExplanation = document.getElementById('preview-explanation');
    const finalUrlInput = document.getElementById('final-url');
    const copyUrlBtn = document.getElementById('copy-url-btn');
    const resetQueryBtn = document.getElementById('reset-query-btn');
    const addToFavoritesBtn = document.getElementById('add-to-favorites-btn');
    const toggleThemeBtn = document.getElementById('toggle-theme-btn');
    const langSelect = document.getElementById('lang-select');
    const historyList = document.getElementById('history-list');
    const favoritesList = document.getElementById('favorites-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const searchResultsList = document.getElementById('search-results-list');
    const loadMoreBtn = document.getElementById('load-more-btn');

    // عناصر Modal
    const commandModal = document.getElementById('command-modal'); // Keep for now, might be removed
    const modalTitle = document.getElementById('modal-title');
    const modalInput = document.getElementById('modal-input');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    const modalPredefinedChoices = document.getElementById('modal-predefined-choices');
    const favoriteNameModal = document.getElementById('favorite-name-modal');
    const favoriteNameInput = document.getElementById('favorite-name-input');
    const saveFavoriteBtn = document.getElementById('save-favorite-btn');
    const closeBtns = document.querySelectorAll('.close-btn');

    // متغيرات الحالة
    let queryState = {
        keywords: '',
        sources: [], // Array of selected source URLs
        filetype: '',
        domain: '',
        year: '',
        language: '',
        exclude: '',
        exact: '', // Kept for potential future use or if command modal is reused
        intitle: '' // Kept for potential future use or if command modal is reused
    };
    let currentCommand = ''; // Used by the old command modal

    // --- 2. نظام تغيير اللغة (Internationalization) ---
    const locales = {
        ar: {
            appTitle: "Academic Search App",
            sourceSelectorTitle: "مصادر البحث",
            advancedFiltersTitle: "فلاتر متقدمة",
            filetypeFilter: "نوع الملف:",
            domainFilter: "المجال:",
            yearFilter: "السنة:",
            languageFilter: "اللغة:",
            excludeFilter: "استبعاد كلمات:",
            mainInputPlaceholder: "ابحث عن مقالات، أبحاث، كتب...",
            searchNowBtn: "ابحث الآن",
            queryPreviewTitle: "الاستعلام النهائي:",
            queryPreviewPlaceholder: "لم تقم بتكوين أي استعلام بعد.",
            finalUrlTitle: "رابط البحث:",
            copyBtn: "نسخ",
            addToFavoritesBtn: "أضف للمفضلة",
            resetQueryBtn: "إعادة تعيين",
            resultsTitle: "نتائج البحث",
            historyTitle: "سجلّ البحث",
            favoritesTitle: "الاستعلامات المفضلة",
            toggleThemeBtnKey: "التبديل إلى الوضع الداكن", // Initial text, will be updated
            clearHistoryBtn: "مسح السجلّ",
            saveBtn: "حفظ",
            saveToFavoritesTitle: "حفظ في المفضلة",
            favoriteNamePlaceholder: "أدخل اسمًا للاستعلام...",
            historyEmpty: "لا يوجد أي سجل بحث حتى الآن.",
            favoritesEmpty: "لا توجد أي استعلامات محفوظة في المفضلة.",
            confirmDelete: "هل أنت متأكد من حذف هذا العنصر؟",
            confirmClearHistory: "تحذير: سيتم حذف جميع سجلات البحث بشكل نهائي. هل أنت متأكد؟",
            urlCopied: "تم نسخ الرابط!",
            queryEmpty: "يرجى إدخال كلمات مفتاحية أولاً.",
            favoriteNameMissing: "يرجى إدخال اسم للاستعلام.",
            reSearch: "إعادة البحث",
            copy: "نسخ",
            delete: "حذف",
            apply: "تطبيق",
            engineLabel: "المصدر",
            privacyPolicy: "سياسة الخصوصية",
            termsOfUse: "شروط الاستخدام",
            contactUs: "تواصل معنا",
            selectAll: "تحديد الكل",
            clearAll: "مسح الكل",
            loadMore: "تحميل المزيد",
        },
        en: {
            appTitle: "Academic Search App",
            sourceSelectorTitle: "Search Sources",
            advancedFiltersTitle: "Advanced Filters",
            filetypeFilter: "File Type:",
            domainFilter: "Domain:",
            yearFilter: "Year:",
            languageFilter: "Language:",
            excludeFilter: "Exclude Keywords:",
            mainInputPlaceholder: "Search for articles, research, books...",
            searchNowBtn: "Search Now",
            queryPreviewTitle: "Final Query:",
            queryPreviewPlaceholder: "You have not built a query yet.",
            finalUrlTitle: "Search URL:",
            copyBtn: "Copy",
            addToFavoritesBtn: "Add to Favorites",
            resetQueryBtn: "Reset",
            resultsTitle: "Search Results",
            historyTitle: "Search History",
            favoritesTitle: "Favorite Queries",
            toggleThemeBtnKey: "Switch to Dark Mode", // Initial text, will be updated
            clearHistoryBtn: "Clear History",
            saveBtn: "Save",
            saveToFavoritesTitle: "Save to Favorites",
            favoriteNamePlaceholder: "Enter a name for the query...",
            historyEmpty: "No search history yet.",
            favoritesEmpty: "No favorite queries saved yet.",
            confirmDelete: "Are you sure you want to delete this item?",
            confirmClearHistory: "Warning: This will permanently delete your entire search history. Are you sure?",
            urlCopied: "URL copied to clipboard!",
            queryEmpty: "Please enter keywords first.",
            favoriteNameMissing: "Please enter a name for the query.",
            reSearch: "Re-search",
            copy: "Copy",
            delete: "Delete",
            apply: "Apply",
            engineLabel: "Source",
            privacyPolicy: "Privacy Policy",
            termsOfUse: "Terms of Use",
            contactUs: "Contact Us",
            selectAll: "Select All",
            clearAll: "Clear All",
            loadMore: "Load More",
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
            const translation = locales[lang][key];
            if (translation) {
                if (el.placeholder) el.placeholder = translation;
                else el.textContent = translation;
            }
        });
        // Special handling for toggleThemeBtnKey as its text changes based on current theme
        updateThemeButtonText();
        // Update button texts for select/clear all sources
        selectAllSourcesBtn.textContent = locales[lang].selectAll;
        clearAllSourcesBtn.textContent = locales[lang].clearAll;
        loadMoreBtn.textContent = locales[lang].loadMore;

        updateQueryPreviewAndUrl();
        loadHistory(); // Reload history with new language
        loadFavorites(); // Reload favorites with new language
    };

    const deviceId = (() => {
        let id = localStorage.getItem('deviceId');
        if (!id) { id = 'web-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9); localStorage.setItem('deviceId', id); }
        return id;
    })();

    // --- 3. وظائف بناء الاستعلام وتحديث الواجهة ---
    const updateQueryPreviewAndUrl = () => {
        queryState.keywords = mainInput.value.trim();
        const lang = localStorage.getItem('language') || 'ar';
        let queryParts = [];

        if (queryState.keywords) queryParts.push(queryState.keywords);
        if (queryState.filetype) queryParts.push(`filetype:${queryState.filetype}`);
        // Domain, Year, Language are typically not direct search operators for all engines
        // They would be handled by the search engine's advanced search page or API
        // For now, we'll include them as general keywords if they are not specific operators
        if (queryState.domain) queryParts.push(queryState.domain);
        if (queryState.year) queryParts.push(queryState.year);
        if (queryState.language) queryParts.push(`lang:${queryState.language}`); // Some engines support lang:
        if (queryState.exclude) queryParts.push(`-${queryState.exclude}`);
        // If exact/intitle are still used from the old command modal
        if (queryState.exact) queryParts.push(`"${queryState.exact}"`);
        if (queryState.intitle) queryParts.push(`intitle:"${queryState.intitle}"`);
        
        const fullQuery = queryParts.join(' ');
        previewExplanation.textContent = fullQuery || locales[lang].queryPreviewPlaceholder;

        // Construct URLs for selected sources
        const selectedSources = Array.from(sourceChips)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => ({
                name: checkbox.value,
                url: checkbox.dataset.url + encodeURIComponent(fullQuery)
            }));
        
        // For simplicity, finalUrlInput will show the URL for the first selected source
        // In a real app, you'd search all selected sources and display results from each
        finalUrlInput.value = selectedSources.length > 0 ? selectedSources[0].url : '';
        queryState.sources = selectedSources; // Store selected sources with their URLs
    };

    // --- 4. وظائف فتح وإغلاق الـ Modals (قد تتغير أو تُزال) ---
    const openModal = (type) => {
        currentCommand = type;
        const lang = localStorage.getItem('language') || 'ar';
        // This part is from the old design, might not be needed with new filters
        const keyMap = { site: 'cmdSite', filetype: 'cmdFiletype', exclude: 'cmdExclude', exact: 'cmdExact', intitle: 'cmdIntitle' };
        modalTitle.textContent = locales[lang][keyMap[type]] || type; // Fallback if key not found
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

    // --- 5. وظائف الثيم ---
    const applyTheme = (theme) => {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        document.body.classList.toggle('light-theme', theme !== 'dark');
        localStorage.setItem('theme', theme);
        updateThemeButtonText();
    };

    const updateThemeButtonText = () => {
        const lang = localStorage.getItem('language') || 'ar';
        const theme = localStorage.getItem('theme') || 'light';
        const icon = toggleThemeBtn.querySelector('i');
        if (theme === 'light') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            toggleThemeBtn.setAttribute('title', locales[lang].toggleThemeBtnKey); // "Switch to Dark Mode"
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            toggleThemeBtn.setAttribute('title', locales[lang].toggleThemeBtnKey); // "Switch to Light Mode"
        }
    };

    // --- 6. معالجات الأحداث ---

    // Main search input in header
    mainInputHeader.addEventListener('input', () => {
        mainInput.value = mainInputHeader.value; // Sync with main input
        updateQueryPreviewAndUrl();
    });
    searchBtnHeader.addEventListener('click', () => {
        searchNowBtn.click(); // Trigger main search button
    });

    // Main search input in center content
    mainInput.addEventListener('input', () => {
        mainInputHeader.value = mainInput.value; // Sync with header input
        updateQueryPreviewAndUrl();
    });

    // Source chips selection
    sourceChips.forEach(chip => {
        chip.addEventListener('change', updateQueryPreviewAndUrl);
    });

    selectAllSourcesBtn.addEventListener('click', () => {
        sourceChips.forEach(chip => chip.checked = true);
        updateQueryPreviewAndUrl();
    });

    clearAllSourcesBtn.addEventListener('click', () => {
        sourceChips.forEach(chip => chip.checked = false);
        updateQueryPreviewAndUrl();
    });

    // Filter inputs
    filetypeFilter.addEventListener('change', (e) => { queryState.filetype = e.target.value; updateQueryPreviewAndUrl(); });
    domainFilter.addEventListener('change', (e) => { queryState.domain = e.target.value; updateQueryPreviewAndUrl(); });
    yearFilter.addEventListener('input', (e) => { queryState.year = e.target.value; updateQueryPreviewAndUrl(); });
    languageFilter.addEventListener('change', (e) => { queryState.language = e.target.value; updateQueryPreviewAndUrl(); });
    excludeFilter.addEventListener('input', (e) => { queryState.exclude = e.target.value; updateQueryPreviewAndUrl(); });

    // Modal save button (for old command modal)
    modalSaveBtn.addEventListener('click', () => {
        queryState[currentCommand] = modalInput.value.trim();
        updateQueryPreviewAndUrl();
        closeModal();
    });

    // Close buttons for modals
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    window.addEventListener('click', (e) => {
        if (e.target === commandModal || e.target === favoriteNameModal) closeModal();
    });

    // Copy URL button
    copyUrlBtn.addEventListener('click', () => {
        if (!finalUrlInput.value) return;
        finalUrlInput.select();
        document.execCommand('copy');
        alert(locales[localStorage.getItem('language') || 'ar'].urlCopied);
    });

    // Reset Query button
    resetQueryBtn.addEventListener('click', () => {
        queryState = { keywords: '', sources: [], filetype: '', domain: '', year: '', language: '', exclude: '', exact: '', intitle: '' };
        mainInput.value = '';
        mainInputHeader.value = '';
        sourceChips.forEach(chip => chip.checked = false); // Uncheck all sources
        filetypeFilter.value = '';
        domainFilter.value = '';
        yearFilter.value = '';
        languageFilter.value = '';
        excludeFilter.value = '';
        updateQueryPreviewAndUrl();
    });

    // Search Now button
    searchNowBtn.addEventListener('click', () => {
        if (!queryState.keywords) {
            alert(locales[localStorage.getItem('language') || 'ar'].queryEmpty);
            return;
        }
        // In a real application, you would iterate through queryState.sources
        // and open a new tab for each, or fetch results via API.
        // For this example, we'll just open the first source's URL.
        if (queryState.sources.length > 0) {
            window.open(queryState.sources[0].url, '_blank');
            saveToHistory();
            // Simulate loading results (replace with actual API calls)
            simulateSearchResults(queryState.keywords, queryState.sources[0].name);
        } else {
            alert("Please select at least one search source."); // New message
        }
    });

    // Theme toggle button
    toggleThemeBtn.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    // Language select
    langSelect.addEventListener('change', () => setLanguage(langSelect.value));

    // --- 7. وظائف Firebase (History & Favorites) ---
    const saveToHistory = async () => {
        try {
            // Save the first selected source's name and URL for history display
            const selectedEngineName = queryState.sources.length > 0 ? queryState.sources[0].name : 'N/A';
            const selectedEngineUrl = queryState.sources.length > 0 ? queryState.sources[0].url : 'N/A';

            await db.collection('Searches').add({
                deviceId: deviceId,
                queryData: queryState, // Save full queryState
                queryText: previewExplanation.textContent,
                engine: selectedEngineName,
                url: selectedEngineUrl,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error saving to history: ", error);
        }
    };

    const renderList = (element, collectionName, docs, emptyKey, renderer) => {
        const lang = localStorage.getItem('language') || 'ar';
        if (docs.empty) {
            element.innerHTML = `<div class="card empty-list-message">${locales[lang][emptyKey]}</div>`;
            return;
        }
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
            item.innerHTML = `
                <h4>${data.queryData.keywords || 'No Keywords'}</h4>
                <p class="query-text">${data.queryText}</p>
                <p class="meta-info">${locales[lang].engineLabel}: ${data.engine} | ${date}</p>
                <div class="item-actions">
                    <button class="btn-secondary-sm" onclick="window.open('${data.url}', '_blank')">${locales[lang].reSearch}</button>
                    <button class="btn-secondary-sm delete-item" data-collection="Searches" data-id="${doc.id}">${locales[lang].delete}</button>
                </div>
            `;
            historyList.appendChild(item);
        });
    };

    const loadFavorites = async () => {
        const snapshot = await db.collection('Favorites').where('deviceId', '==', deviceId).orderBy('createdAt', 'desc').get();
        renderList(favoritesList, 'Favorites', snapshot, 'favoritesEmpty', (doc, lang) => {
            const data = doc.data();
            const item = document.createElement('div');
            item.className = 'list-item card';
            item.innerHTML = `
                <h4>${data.queryName}</h4>
                <p class="meta-info">${locales[lang].engineLabel}: ${data.engine}</p>
                <div class="item-actions">
                    <button class="btn-secondary-sm apply-favorite" data-id="${doc.id}">${locales[lang].apply}</button>
                    <button class="btn-secondary-sm delete-item" data-collection="Favorites" data-id="${doc.id}">${locales[lang].delete}</button>
                </div>
            `;
            favoritesList.appendChild(item);
        });
    };

    addToFavoritesBtn.addEventListener('click', () => {
        if (!queryState.keywords) {
            alert(locales[localStorage.getItem('language') || 'ar'].queryEmpty);
            return;
        }
        favoriteNameModal.style.display = 'flex';
        favoriteNameInput.focus();
    });

    saveFavoriteBtn.addEventListener('click', async () => {
        const name = favoriteNameInput.value.trim();
        if (!name) {
            alert(locales[localStorage.getItem('language') || 'ar'].favoriteNameMissing);
            return;
        }
        // Save the first selected source's name and URL for favorites display
        const selectedEngineName = queryState.sources.length > 0 ? queryState.sources[0].name : 'N/A';
        const selectedEngineValue = queryState.sources.length > 0 ? queryState.sources[0].url : 'N/A'; // Use URL as value

        await db.collection('Favorites').add({
            deviceId: deviceId,
            queryName: name,
            queryData: queryState, // Save full queryState
            engine: selectedEngineName,
            engineValue: selectedEngineValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        favoriteNameInput.value = '';
        closeModal();
        loadFavorites(); // Reload favorites list
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
        if (e.target.matches('.delete-item')) {
            if (confirm(locales[lang].confirmDelete)) {
                const { collection, id } = e.target.dataset;
                await db.collection(collection).doc(id).delete();
                if (collection === 'Searches') loadHistory();
                else loadFavorites();
            }
        }
        if (e.target.matches('.apply-favorite')) {
            const doc = await db.collection('Favorites').doc(e.target.dataset.id).get();
            if (doc.exists) {
                const data = doc.data();
                queryState = data.queryData; // Restore full query state
                mainInput.value = queryState.keywords || '';
                mainInputHeader.value = queryState.keywords || '';

                // Restore source selections
                sourceChips.forEach(chip => {
                    chip.checked = queryState.sources.some(s => s.name === chip.value);
                });

                // Restore filter values
                filetypeFilter.value = queryState.filetype || '';
                domainFilter.value = queryState.domain || '';
                yearFilter.value = queryState.year || '';
                languageFilter.value = queryState.language || '';
                excludeFilter.value = queryState.exclude || '';

                updateQueryPreviewAndUrl();
                // No screen navigation needed as we are already on the main screen
            }
        }
    });

    // --- 8. وظائف تصدير البيانات ---
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

    // Export JSON and CSV buttons (assuming they are in settings, not explicitly in new HTML)
    // You'll need to add these buttons back to the settings section if you want them.
    // For now, I'll comment out their event listeners.
    /*
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
    */

    // --- 9. وظائف محاكاة النتائج (للتوضيح فقط) ---
    const simulateSearchResults = (keywords, sourceName) => {
        searchResultsList.innerHTML = ''; // Clear previous results
        const lang = localStorage.getItem('language') || 'ar';
        const dummyResults = [
            { title: `بحث حول ${keywords} في ${sourceName}`, authors: "أحمد، محمد", journal: "مجلة العلوم", year: "2024", filetype: "PDF", snippet: "ملخص قصير يصف محتوى البحث، يظهر هنا لمساعدة المستخدم على فهم ما إذا كانت النتيجة ذات صلة.", url: "https://example.com/doc1.pdf" },
            { title: `دراسة حالة عن ${keywords} في ${sourceName}`, authors: "فاطمة، زينب", journal: "المؤتمر الدولي", year: "2023", filetype: "HTML", snippet: "ملخص قصير يصف محتوى البحث، يظهر هنا لمساعدة المستخدم على فهم ما إذا كانت النتيجة ذات صلة.", url: "https://example.com/doc2.html" },
            { title: `تحليل ${keywords} وتأثيره`, authors: "علي، سارة", journal: "رسالة دكتوراه", year: "2022", filetype: "DOC", snippet: "ملخص قصير يصف محتوى البحث، يظهر هنا لمساعدة المستخدم على فهم ما إذا كانت النتيجة ذات صلة.", url: "https://example.com/doc3.doc" },
        ];

        dummyResults.forEach(result => {
            const item = document.createElement('div');
            item.className = 'card result-item';
            item.innerHTML = `
                <h3 class="result-title"><a href="${result.url}" target="_blank">${result.title}</a></h3>
                <p class="result-meta">${result.authors} • ${result.journal} • ${result.year}</p>
                <div class="result-badges">
                    <span class="badge">${result.filetype}</span>
                    <span class="badge">${sourceName}</span>
                </div>
                <p class="result-snippet">${result.snippet}</p>
                <div class="result-actions">
                    <a href="${result.url}" target="_blank" class="btn-primary-sm"><i class="fas fa-external-link-alt"></i> ${lang === 'ar' ? 'فتح المصدر' : 'Open Source'}</a>
                    <button class="btn-secondary-sm"><i class="fas fa-bookmark"></i> ${lang === 'ar' ? 'حفظ' : 'Save'}</button>
                    <button class="btn-secondary-sm"><i class="fas fa-share-alt"></i> ${lang === 'ar' ? 'مشاركة' : 'Share'}</button>
                </div>
            `;
            searchResultsList.appendChild(item);
        });
        loadMoreBtn.style.display = 'block'; // Show load more button
    };

    loadMoreBtn.addEventListener('click', () => {
        // Simulate loading more results
        const lang = localStorage.getItem('language') || 'ar';
        const currentKeywords = queryState.keywords || "نتائج إضافية";
        const currentSource = queryState.sources.length > 0 ? queryState.sources[0].name : "مصدر غير محدد";
        simulateSearchResults(currentKeywords, currentSource); // Append more results
    });


    // --- 10. التهيئة الأولية ---
    const initialLang = localStorage.getItem('language') || 'ar';
    setLanguage(initialLang);
    const initialTheme = localStorage.getItem('theme') || 'light';
    applyTheme(initialTheme);

    // Load history and favorites on initial load
    loadHistory();
    loadFavorites();
});