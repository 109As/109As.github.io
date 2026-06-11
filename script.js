class MelodyMemoryGame {
    constructor() {
        this.noteFrequencies = {
            // 低音区（降1）- 从下往上第一行 (C3到B3)
            'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81,
            'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00,
            'A#3': 233.08, 'B3': 246.94,
            // 中音区（标准1）- 从下往上第二行 (C4到B4)
            'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
            'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
            'A#4': 466.16, 'B4': 493.88,
            // 高音区（升7）- 从下往上第三行 (C5到B5)
            'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25,
            'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00,
            'A#5': 932.33, 'B5': 987.77
        };

        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        this.highScore = 0;
        this.isPlaying = false;
        this.isShowingSequence = false;
        this.currentMode = 'play';

        this.isRecording = false;
        this.recordedSequence = [];
        this.lastNoteTime = 0;
        this.customLevels = [];
        this.pressedKeys = {}; // 追踪当前按下的键，防止长按重复触发
        this.keyPressStartTimes = {}; // 记录按键开始时间，用于判断长按
        this.activeSounds = {}; // 存储当前播放的声音对象，用于长按控制

        this.lessons = {
            twinkle: {
                name: '小星星 Twinkle Twinkle',
                notes: ['C4', 'C4', 'G4', 'G4', 'A4', 'A4', 'G4', 'F4', 'F4', 'E4', 'E4', 'D4', 'D4', 'C4']
            },
            happybirthday: {
                name: '生日快乐 Happy Birthday',
                notes: ['C4', 'C4', 'D4', 'C4', 'F4', 'E4', 'C4', 'C4', 'D4', 'C4', 'G4', 'F4']
            },
            ode: {
                name: '欢乐颂 Ode to Joy',
                notes: ['E4', 'E4', 'F4', 'G4', 'G4', 'F4', 'E4', 'D4', 'C4', 'C4', 'D4', 'E4', 'E4', 'D4', 'D4']
            },
            scale: {
                name: '音阶练习 Scale Practice',
                notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4']
            },
        };

        this.pianoKeys = document.querySelectorAll('.piano-key');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.status = document.getElementById('status');
        this.levelDisplay = document.querySelector('.level');
        this.scoreDisplay = document.querySelector('.score');
        this.highScoreDisplay = document.querySelector('.high-score');

        this.modeButtons = {
            play: document.getElementById('play-mode-btn'),
            listen: document.getElementById('listen-mode-btn'),
            edit: document.getElementById('edit-mode-btn'),
            lesson: document.getElementById('lesson-mode-btn'),
            advanced: document.getElementById('advanced-mode-btn')
        };

        this.lessonPanel = document.getElementById('lesson-panel');
        this.levelList = document.getElementById('custom-levels');

        this.clearBtn = document.getElementById('clear-btn');
        this.randomBtn = document.getElementById('random-btn');
        this.saveLevelBtn = document.getElementById('save-level-btn');
        this.loadLessonBtn = document.getElementById('load-lesson-btn');

        this.noteCountDisplay = document.getElementById('note-count');
        
        // 时间轴编辑器（小图形式）
        this.timelineNodes = document.getElementById('timeline-nodes');
        this.timelineRecordBtn = document.getElementById('timeline-record');
        this.timelinePlayBtn = document.getElementById('timeline-play');
        this.timelineStopBtn = document.getElementById('timeline-stop');
        this.timelineAddBtn = document.getElementById('timeline-add');
        this.timelineDeleteBtn = document.getElementById('timeline-delete');
        this.timelineTime = document.getElementById('timeline-time');
        this.newLevelBtn = document.getElementById('new-level-btn');
        
        // 音符时值选择器
        this.noteQuarterBtn = document.getElementById('note-quarter');
        this.noteEighthBtn = document.getElementById('note-eighth');
        this.noteSixteenthBtn = document.getElementById('note-sixteenth');
        this.currentNoteValue = 'quarter'; // 默认四分音符
        
        this.timelinePlaying = false;
        this.timelineCurrentIndex = 0;
        this.timelineAnimationId = null;
        this.selectedTimelineNode = null;
        
        this.currentEditingLevelId = null; // 当前正在编辑的关卡ID
        
        // 21个音符定义（三排七列）
        // 第一行：低音区（降1）C3-B3
        // 第二行：中音区（标准1）C4-B4
        // 第三行：高音区（升1）C5-B5
        this.rollNotes = [
            { note: 'C3', name: 'C3', type: 'white' },
            { note: 'D3', name: 'D3', type: 'white' },
            { note: 'E3', name: 'E3', type: 'white' },
            { note: 'F3', name: 'F3', type: 'white' },
            { note: 'G3', name: 'G3', type: 'white' },
            { note: 'A3', name: 'A3', type: 'white' },
            { note: 'B3', name: 'B3', type: 'white' },
            { note: 'C4', name: 'C4', type: 'white' },
            { note: 'D4', name: 'D4', type: 'white' },
            { note: 'E4', name: 'E4', type: 'white' },
            { note: 'F4', name: 'F4', type: 'white' },
            { note: 'G4', name: 'G4', type: 'white' },
            { note: 'A4', name: 'A4', type: 'white' },
            { note: 'B4', name: 'B4', type: 'white' },
            { note: 'C5', name: 'C5', type: 'white' },
            { note: 'D5', name: 'D5', type: 'white' },
            { note: 'E5', name: 'E5', type: 'white' },
            { note: 'F5', name: 'F5', type: 'white' },
            { note: 'G5', name: 'G5', type: 'white' },
            { note: 'A5', name: 'A5', type: 'white' },
            { note: 'B5', name: 'B5', type: 'white' }
        ];
        this.levelDifficultyDisplay = document.getElementById('level-difficulty');
        this.lessonInfo = document.getElementById('lesson-info');

        this.modal = document.getElementById('player-name-modal');
        this.finalScoreSpan = document.getElementById('final-score');
        this.finalLevelSpan = document.getElementById('final-level');
        this.playerNameInput = document.getElementById('player-name-input');
        this.saveScoreBtn = document.getElementById('save-score-btn');
        this.closeModalBtn = document.getElementById('close-modal-btn');

        this.leaderboardList = document.getElementById('leaderboard-list');

        // 登录相关元素
        this.loginForm = document.getElementById('login-form');
        this.userInfo = document.getElementById('user-info');
        this.loginUsername = document.getElementById('login-username');
        this.loginPassword = document.getElementById('login-password');
        this.loginBtn = document.getElementById('login-btn');
        this.registerBtn = document.getElementById('register-btn');
        this.logoutBtn = document.getElementById('logout-btn');
        this.usernameDisplay = document.querySelector('.username');

        // 当前登录用户
        this.currentUser = null;

        this.audioContext = null;

        this.init();
    }

    init() {
        this.initAudio();
        this.loadHighScore();
        this.loadCustomLevels();
        this.loadLeaderboard();
        this.updateDisplay();

        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());

        this.pianoKeys.forEach(key => {
            key.addEventListener('click', () => this.handleKeyClick(key));
            key.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.pressKey(key);
            });
            key.addEventListener('mouseup', () => this.releaseKey(key));
            key.addEventListener('mouseleave', () => this.releaseKey(key));
        });

        Object.keys(this.modeButtons).forEach(mode => {
            this.modeButtons[mode].addEventListener('click', () => this.switchMode(mode));
        });

        this.clearBtn.addEventListener('click', () => this.clearEditor());
        this.randomBtn.addEventListener('click', () => this.generateRandom());
        // timelinePlayBtn is already bound in the timeline section
        this.saveLevelBtn.addEventListener('click', () => this.saveCustomLevel());
        this.loadLessonBtn.addEventListener('click', () => this.loadLesson());

        this.saveScoreBtn.addEventListener('click', () => this.saveScore());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());

        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        document.addEventListener('keyup', (e) => this.handleKeyboardUp(e));
        
        // 时间轴编辑器事件
        this.timelineRecordBtn.addEventListener('click', () => this.toggleRecording());
        this.newLevelBtn.addEventListener('click', () => this.newLevel());
        this.timelinePlayBtn.addEventListener('click', () => this.toggleTimelinePlay());
        this.timelineStopBtn.addEventListener('click', () => this.stopTimeline());
        this.timelineAddBtn.addEventListener('click', () => this.addTimelineNode());
        this.timelineDeleteBtn.addEventListener('click', () => this.deleteTimelineNode());
        
        // 音符时值选择器事件
        this.noteQuarterBtn.addEventListener('click', () => this.selectNoteValue('quarter'));
        this.noteEighthBtn.addEventListener('click', () => this.selectNoteValue('eighth'));
        this.noteSixteenthBtn.addEventListener('click', () => this.selectNoteValue('sixteenth'));

        // 登录相关事件
        this.loginBtn.addEventListener('click', () => this.login());
        this.registerBtn.addEventListener('click', () => this.register());
        this.logoutBtn.addEventListener('click', () => this.logout());

        // 数据迁移按钮
        this.exportDataBtn = document.getElementById('export-data-btn');
        this.importDataBtn = document.getElementById('import-data-btn');
        
        // 绑定事件
        this.exportDataBtn.addEventListener('click', () => this.exportUserData());
        this.importDataBtn.addEventListener('click', () => this.importUserData());
        
        // 检查是否有已登录的用户
        this.checkAutoLogin();
    }
    
    selectNoteValue(value) {
        this.currentNoteValue = value;
        
        // 更新按钮样式
        this.noteQuarterBtn.classList.toggle('active', value === 'quarter');
        this.noteEighthBtn.classList.toggle('active', value === 'eighth');
        this.noteSixteenthBtn.classList.toggle('active', value === 'sixteenth');
        
        // 显示选中提示
        const noteNames = {
            quarter: '♩ 四分音符 (500ms)',
            eighth: '♪ 八分音符 (250ms)',
            sixteenth: '♬ 十六分音符 (125ms)'
        };
        
        // 如果状态区域存在，显示选中的音符时值
        if (this.status && this.currentMode === 'edit') {
            this.status.textContent = `✏️ 编辑模式 - 当前选中：${noteNames[value]} | 点击时间轴节点编辑音符，或点击录制按钮开始录制！`;
        }
        
        console.log('📝 选中音符时值:', value);
    }
    
    newLevel() {
        // 新建关卡时询问名称
        const levelName = prompt('请输入关卡名称：', `新建关卡 ${this.customLevels.length + 1}`);
        if (!levelName) return;
        
        // 创建空关卡
        const newLevel = {
            id: Date.now(),
            name: levelName,
            notes: [],
            createdAt: new Date().toISOString()
        };
        
        this.customLevels.push(newLevel);
        this.saveCustomLevelsToStorage();
        
        // 设置当前编辑的关卡ID
        this.currentEditingLevelId = newLevel.id;
        
        // 清空时间轴
        this.recordedSequence = [];
        this.selectedTimelineNode = null;
        
        // 切换到编辑模式
        this.switchMode('edit');
        
        // 立即更新UI
        this.updateTimeline();
        this.updateEditorInfo();
        this.updateMainKeyboardDisplay();
        this.displayCustomLevels();
        
        this.status.textContent = `✏️ 已新建「${levelName}」，开始录制吧！`;
        console.log('📝 新建关卡:', levelName, 'ID:', newLevel.id);
    }
    
    toggleRecording() {
        // 检查是否有当前关卡（新建关卡或选中现有关卡都可以）
        if (!this.currentEditingLevelId) {
            alert('⚠️ 请先点击「新建关卡」创建一个关卡，或选中一个已有的关卡后再进行录制！');
            return;
        }
        
        this.isRecording = !this.isRecording;
        
        if (this.isRecording) {
            // 开始录制
            this.timelineRecordBtn.textContent = '⏹️ 停止录制';
            this.timelineRecordBtn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)';
            
            // 如果没有任何节点，初始化录制状态
            if (this.recordedSequence.length === 0) {
                this.selectedTimelineNode = null;
                this.updateTimeline();
                this.updateEditorInfo();
                this.updateMainKeyboardDisplay();
            }
            // 如果有节点，从最后一个节点之后开始录制，留出一个休止符
            else {
                const lastTime = this.recordedSequence[this.recordedSequence.length - 1].time;
                this.startTime = Date.now() - lastTime;
                console.log('🎤 继续录制，从时间:', lastTime, '开始');
            }
            
            console.log('🎤 开始录制...');
        } else {
            // 停止录制
            this.timelineRecordBtn.textContent = '🔴 录制';
            this.timelineRecordBtn.style.background = '';
            
            // 自动选中最后一个节点，方便编辑
            if (this.recordedSequence.length > 0) {
                this.selectTimelineNode(this.recordedSequence.length - 1);
            }
            
            console.log('🎤 停止录制');
        }
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    playSound(note, duration = 1800) {
        if (!this.audioContext) return;
        if (!this.noteFrequencies[note]) return;

        const now = this.audioContext.currentTime;
        const freq = this.noteFrequencies[note];
        const totalDuration = duration / 1000;

        // 创建主振荡器（基频）- 使用正弦波，纯净基础音色
        const osc1 = this.audioContext.createOscillator();
        const gain1 = this.audioContext.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);

        // 创建第二振荡器（2倍频泛音）- 少量添加增加厚度
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, now);

        // 主音量节点和滤波器
        const masterGain = this.audioContext.createGain();
        const masterFilter = this.audioContext.createBiquadFilter();
        masterFilter.type = 'lowpass';
        masterFilter.frequency.setValueAtTime(7000, now);

        // 创建延音踏板混响效果（更强的混响）
        const convolver = this.audioContext.createConvolver();
        const impulse = this.createReverbImpulse(true); // true = 延音踏板模式
        convolver.buffer = impulse;

        // 连接
        osc1.connect(gain1);
        gain1.connect(masterGain);
        
        osc2.connect(gain2);
        gain2.connect(masterGain);
        
        // 主要信号直接输出
        masterGain.connect(masterFilter);
        masterFilter.connect(this.audioContext.destination);
        
        // 延音踏板混响处理（增加混响量）
        const reverbGain = this.audioContext.createGain();
        reverbGain.gain.setValueAtTime(0.4, now); // 延音踏板混响量
        masterGain.connect(convolver);
        convolver.connect(reverbGain);
        reverbGain.connect(masterFilter);

        // 延音踏板效果包络：快速攻击，较长衰减，缓慢释放
        const attack = 0.005;     // 快速攻击
        const decay = 0.4;        // 较长衰减
        const sustain = 0.35;     // 较高持续音量
        const release = totalDuration - attack - decay;

        // 主振荡器包络（控制在安全音量范围）
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.6, now + attack);
        gain1.gain.linearRampToValueAtTime(sustain, now + attack + decay);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + totalDuration);

        // 第二振荡器包络（减少泛音量避免杂音）
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(0.08, now + attack);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + totalDuration * 0.5);

        // 主音量控制（降低音量避免削波）
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(0.7, now + attack);
        masterGain.gain.linearRampToValueAtTime(sustain, now + attack + decay);
        masterGain.gain.exponentialRampToValueAtTime(0.01, now + totalDuration);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + totalDuration);
        osc2.stop(now + totalDuration);
        
        // 返回用于长按控制
        return {
            oscillators: [osc1, osc2],
            gains: [gain1, gain2, masterGain],
            endTime: now + totalDuration
        };
    }

    // 创建混响脉冲响应（游戏风格）
    createReverbImpulse(useSustainPedal = false) {
        const sampleRate = this.audioContext.sampleRate;
        // 延音踏板模式使用更长的混响时间
        const duration = useSustainPedal ? 1.2 : 0.4;
        const decayTime = useSustainPedal ? 0.4 : 0.15;
        const length = sampleRate * duration;
        const impulse = this.audioContext.createBuffer(1, length, sampleRate);
        const impulseData = impulse.getChannelData(0);

        for (let i = 0; i < length; i++) {
            // 创建指数衰减的噪声，模拟延音踏板效果
            const t = i / sampleRate;
            const envelope = Math.exp(-t / decayTime) * (1 - t / duration);
            impulseData[i] = (Math.random() * 2 - 1) * envelope * (useSustainPedal ? 0.25 : 0.3);
        }

        return impulse;
    }

    pressKey(key) {
        const note = key.dataset.note;
        
        // 防止长按重复触发
        if (this.pressedKeys[note]) {
            return;
        }
        this.pressedKeys[note] = true;
        
        key.classList.add('active');
        
        // 记录开始时间用于长按判断
        this.keyPressStartTimes[note] = Date.now();
        
        // 初始播放时间（四分音符约600ms）
        this.activeSounds[note] = this.playSound(note, 600);

        if (this.currentMode === 'edit') {
            console.log('📝 编辑模式 - selectedTimelineNode:', this.selectedTimelineNode, 'isRecording:', this.isRecording);
            
            // 如果正在录制，优先添加到录制序列
            if (this.isRecording) {
                const now = Date.now();
                
                if (this.recordedSequence.length === 0) {
                    this.recordedSequence = [{
                        time: 0,
                        notes: [note]
                    }];
                    this.startTime = now;
                    console.log('🎵 创建第一个音符:', note);
                } else {
                    const elapsed = now - this.startTime;
                    const lastEvent = this.recordedSequence[this.recordedSequence.length - 1];
                    const timeDiff = elapsed - lastEvent.time;
                    
                    // 如果时间间隔小于100ms，视为同时按下的和弦
                    if (timeDiff < 100) {
                        if (!lastEvent.notes.includes(note)) {
                            lastEvent.notes.push(note);
                            console.log('🎹 添加和弦音符:', note, '到节点:', this.recordedSequence.length - 1);
                        }
                    } else {
                        // 创建新的时间节点，使用实际时间间隔
                        this.recordedSequence.push({
                            time: elapsed,
                            notes: [note]
                        });
                        console.log('🎵 创建新节点:', note, '时间:', elapsed);
                    }
                }
                
                this.updateEditorInfo();
                this.updateTimeline();
                console.log('📊 当前录制序列:', JSON.stringify(this.recordedSequence));
            }
            // 如果选中了一个时间轴节点，编辑该节点
            else if (this.selectedTimelineNode !== null) {
                console.log('✏️ 编辑选中的节点:', this.selectedTimelineNode, '添加音符:', note);
                this.editTimelineNodeNote(this.selectedTimelineNode, note);
            }
            // 如果什么都没有，提示用户
            else {
                console.log('⚠️ 请先点击录制按钮或选择一个节点');
            }
        }
    }
    
    showRecordingData() {
        if (!this.recordingDataDisplay) {
            this.recordingDataDisplay = document.createElement('div');
            this.recordingDataDisplay.style.cssText = 'font-size:12px;color:#666;margin-top:10px;max-height:100px;overflow-y:auto;';
            document.getElementById('timeline-grid').appendChild(this.recordingDataDisplay);
        }
        
        let text = '录制数据：';
        for (let i = 0; i < this.recordedSequence.length; i++) {
            const item = this.recordedSequence[i];
            const interval = i === 0 ? 0 : item.time - this.recordedSequence[i-1].time;
            text += `${item.notes.join('+')}(${interval}ms) `;
        }
        this.recordingDataDisplay.textContent = text;
    }

    releaseKey(key) {
        const note = key.dataset.note;
        
        // 重置按键状态
        this.pressedKeys[note] = false;
        
        // 检查是否长按（超过600ms视为长按）
        const pressDuration = Date.now() - (this.keyPressStartTimes[note] || 0);
        if (pressDuration > 600 && this.activeSounds[note]) {
            // 长按：延长声音
            const now = this.audioContext.currentTime;
            const sound = this.activeSounds[note];
            
            // 延长释放时间，实现长按延续效果
            sound.gains.forEach(gain => {
                gain.gain.cancelScheduledValues(now);
                gain.gain.linearRampToValueAtTime(0.15, now + 0.5);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 2.0);
            });
            
            sound.oscillators.forEach(osc => {
                osc.stop(now + 2.0);
            });
        }
        
        // 清理引用
        delete this.activeSounds[note];
        delete this.keyPressStartTimes[note];
        
        // 录制模式下立即清除高亮
        if (this.isRecording) {
            key.classList.remove('active');
            return;
        }
        // 在编辑模式下，只有当点击主键盘时才能切换音符状态
        // 不自动清除active状态，由updateMainKeyboardDisplay管理
        if (this.currentMode !== 'edit' || this.selectedTimelineNode === null) {
            key.classList.remove('active');
        }
    }

    handleKeyboard(e) {
        const keyMap = {
            // 高音区（升7）- Q W E R T Y U
            'q': 'C5', 'w': 'D5', 'e': 'E5', 'r': 'F5', 't': 'G5', 'y': 'A5', 'u': 'B5',
            'Q': 'C5', 'W': 'D5', 'E': 'E5', 'R': 'F5', 'T': 'G5', 'Y': 'A5', 'U': 'B5',
            // 中音区（标准）- A S D F G H J
            'a': 'C4', 's': 'D4', 'd': 'E4', 'f': 'F4', 'g': 'G4', 'h': 'A4', 'j': 'B4',
            'A': 'C4', 'S': 'D4', 'D': 'E4', 'F': 'F4', 'G': 'G4', 'H': 'A4', 'J': 'B4',
            // 低音区（降1）- Z X C V B N M
            'z': 'C3', 'x': 'D3', 'c': 'E3', 'v': 'F3', 'b': 'G3', 'n': 'A3', 'm': 'B3',
            'Z': 'C3', 'X': 'D3', 'C': 'E3', 'V': 'F3', 'B': 'G3', 'N': 'A3', 'M': 'B3'
        };

        if (keyMap[e.key]) {
            const note = keyMap[e.key];
            // 直接播放声音，不依赖DOM查询
            this.playSound(note, 600);
            
            // 仅在非纯听模式下更新视觉反馈
            if (this.currentMode !== 'listen') {
                const key = document.querySelector(`.piano-key[data-note="${note}"]`);
                if (key) {
                    // 录制模式：继续录制，不取消
                    if (this.isRecording) {
                        this.pressKey(key);
                    }
                    // 编辑模式下允许重复按键取消音符（toggle效果）
                    else if (this.currentMode === 'edit') {
                        if (key.classList.contains('active')) {
                            // 如果已经激活，取消该音符
                            this.editTimelineNodeNote(this.selectedTimelineNode, note);
                            key.classList.remove('active');
                        } else {
                            // 如果未激活，添加该音符
                            this.pressKey(key);
                        }
                    } else {
                        // 演奏模式和练习模式：添加按键反馈
                        if (!key.classList.contains('active')) {
                            key.classList.add('active');
                            
                            // 演奏模式需要isPlaying状态，练习模式直接处理
                            if ((this.isPlaying || this.currentMode === 'lesson') && !this.isShowingSequence) {
                                this.handleKeyClick(key);
                            }
                        }
                    }
                }
            } else {
                // 纯听模式：只播放声音，不处理按键判断，让用户自由听
                // 但如果是游戏中，仍需要判断正确性
                if (this.isPlaying && !this.isShowingSequence) {
                    // 直接用note判断，不依赖DOM
                    this.playerSequence.push(note);
                    const currentIndex = this.playerSequence.length - 1;
                    if (note !== this.sequence[currentIndex]) {
                        this.gameOver();
                        return;
                    }
                    if (this.playerSequence.length === this.sequence.length) {
                        this.levelComplete();
                    }
                }
            }
        }
    }

    handleKeyboardUp(e) {
        const keyMap = {
            // 高音区（升7）
            'q': 'C5', 'w': 'D5', 'e': 'E5', 'r': 'F5', 't': 'G5', 'y': 'A5', 'u': 'B5',
            'Q': 'C5', 'W': 'D5', 'E': 'E5', 'R': 'F5', 'T': 'G5', 'Y': 'A5', 'U': 'B5',
            // 中音区（标准）
            'a': 'C4', 's': 'D4', 'd': 'E4', 'f': 'F4', 'g': 'G4', 'h': 'A4', 'j': 'B4',
            'A': 'C4', 'S': 'D4', 'D': 'E4', 'F': 'F4', 'G': 'G4', 'H': 'A4', 'J': 'B4',
            // 低音区（降1）
            'z': 'C3', 'x': 'D3', 'c': 'E3', 'v': 'F3', 'b': 'G3', 'n': 'A3', 'm': 'B3',
            'Z': 'C3', 'X': 'D3', 'C': 'E3', 'V': 'F3', 'B': 'G3', 'N': 'A3', 'M': 'B3'
        };

        if (keyMap[e.key]) {
            const note = keyMap[e.key];
            const key = document.querySelector(`.piano-key[data-note="${note}"]`);
            if (key) {
                this.releaseKey(key);
            }
        }
    }

    switchMode(mode) {
        this.currentMode = mode;
        Object.keys(this.modeButtons).forEach(m => {
            this.modeButtons[m].classList.toggle('active', m === mode);
        });

        const timelineEditor = document.querySelector('.timeline-editor');
        const timelineControls = document.querySelector('.timeline-controls');
        const editorButtons = ['timeline-record', 'timeline-add', 'timeline-delete', 'clear-btn', 'random-btn', 'save-level-btn'];
        const timelinePlayButtons = ['timeline-play', 'timeline-stop'];
        
        if (mode === 'edit') {
            // 编辑模式：显示完整的时间轴编辑器
            if (timelineEditor) timelineEditor.style.display = 'block';
            if (timelineControls) timelineControls.style.display = 'flex';
            editorButtons.forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.style.display = 'inline-block';
            });
            timelinePlayButtons.forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.style.display = 'inline-block';
            });
        } else if (mode === 'lesson') {
            // 练习模式：只显示时间轴，隐藏编辑按钮
            if (timelineEditor) timelineEditor.style.display = 'block';
            if (timelineControls) timelineControls.style.display = 'flex';
            editorButtons.forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.style.display = 'none';
            });
            timelinePlayButtons.forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.style.display = 'inline-block';
            });
        } else if (mode === 'advanced') {
            // 高级编辑模式：跳转到高级编辑器页面
            window.location.href = 'advanced-editor.html';
            return;
        } else if (mode === 'play' || mode === 'listen') {
            // 记忆挑战模式和纯听模式：隐藏时间轴编辑器
            if (timelineEditor) timelineEditor.style.display = 'none';
            if (timelineControls) timelineControls.style.display = 'none';
        }
        
        if (this.lessonPanel) {
            this.lessonPanel.style.display = mode === 'lesson' ? 'block' : 'none';
        }
        
        // 清除主键盘的active状态（包括练习模式的高亮）
        this.pianoKeys.forEach(key => {
            key.classList.remove('active', 'lesson-hint');
        });
        
        // 重置练习模式状态
        this.lessonCurrentIndex = null;
        this.lessonPressedNotes = null;
        this.selectedTimelineNode = null;
        
        // 更新时间轴，清除练习模式高亮
        this.updateTimeline();

        if (mode === 'play') {
            this.status.textContent = '🎮 记忆挑战：记住旋律顺序，然后按顺序演奏出来！';
            this.isRecording = false;
            // 重置录制按钮显示状态
            if (this.timelineRecordBtn) {
                this.timelineRecordBtn.textContent = '🔴 录制';
                this.timelineRecordBtn.style.background = '';
            }
        } else if (mode === 'listen') {
            this.status.textContent = '🎵 纯听模式：只有声音，没有视觉反馈！';
            this.isRecording = false;
            // 重置录制按钮显示状态
            if (this.timelineRecordBtn) {
                this.timelineRecordBtn.textContent = '🔴 录制';
                this.timelineRecordBtn.style.background = '';
            }
        } else if (mode === 'edit') {
            this.status.textContent = '✏️ 编辑模式：点击时间轴节点编辑音符，或点击录制按钮开始录制！';
            this.isRecording = false;
            this.startTime = Date.now();
            if (this.recordedSequence.length > 0) {
                this.lastNoteTime = this.recordedSequence[this.recordedSequence.length - 1].time;
            } else {
                this.lastNoteTime = 0;
            }
            // 更新录制按钮显示状态（默认未录制）
            if (this.timelineRecordBtn) {
                this.timelineRecordBtn.textContent = '🔴 录制';
                this.timelineRecordBtn.style.background = '';
            }
        } else if (mode === 'lesson') {
            this.status.textContent = '📚 练习模式：时间轴显示需要按的音符，正确按下进入下一个！';
            this.isRecording = false;
            // 重置录制按钮显示状态
            if (this.timelineRecordBtn) {
                this.timelineRecordBtn.textContent = '🔴 录制';
                this.timelineRecordBtn.style.background = '';
            }
        }
    }

    updateEditorInfo() {
        const totalNotes = this.recordedSequence.length;
        if (this.noteCountDisplay) {
            this.noteCountDisplay.textContent = totalNotes;
        }
        if (this.levelDifficultyDisplay) {
            const difficulty = this.recordedSequence.length <= 5 ? '简单' :
                              this.recordedSequence.length <= 10 ? '普通' : '困难';
            this.levelDifficultyDisplay.textContent = difficulty;
        }
    }

    clearEditor() {
        this.recordedSequence = [];
        this.lastNoteTime = 0;
        this.updateEditorInfo();
        this.updateTimeline();
        this.status.textContent = '✅ 编辑器已清空，开始录制新旋律！';
    }

    generateRandom() {
        const allNotes = Object.keys(this.noteFrequencies);
        const length = Math.floor(Math.random() * 10) + 5;
        this.recordedSequence = [];
        let time = 0;

        for (let i = 0; i < length; i++) {
            const note = allNotes[Math.floor(Math.random() * allNotes.length)];
            this.recordedSequence.push({
                time: time,
                notes: [note]
            });
            time += 300 + Math.floor(Math.random() * 300);
        }

        this.updateEditorInfo();
        this.updateTimeline();
        this.status.textContent = '🎲 已生成随机旋律，点击播放按钮听听效果！';
    }

    saveCustomLevel() {
        console.log('🎯 saveCustomLevel 被调用');
        console.log('📝 recordedSequence:', JSON.stringify(this.recordedSequence));
        console.log('📝 currentEditingLevelId:', this.currentEditingLevelId);
        console.log('📝 customLevels.length:', this.customLevels.length);
        console.log('📝 customLevels:', JSON.stringify(this.customLevels));
        
        if (this.recordedSequence.length === 0) {
            this.status.textContent = '⚠️ 请先录制一些音符！';
            return;
        }
        
        if (!this.currentEditingLevelId) {
            this.status.textContent = '⚠️ 请先新建关卡！';
            return;
        }

        // 将绝对时间转换为相对时间
        const convertedNotes = [];
        let lastTime = 0;
        for (let i = 0; i < this.recordedSequence.length; i++) {
            const item = this.recordedSequence[i];
            convertedNotes.push({
                time: i === 0 ? 0 : (item.time - lastTime),
                notes: [...item.notes]
            });
            lastTime = item.time;
        }

        // 找到当前正在编辑的关卡并更新
        const levelIndex = this.customLevels.findIndex(l => l.id === this.currentEditingLevelId);
        console.log('📝 levelIndex:', levelIndex);
        
        if (levelIndex !== -1) {
            this.customLevels[levelIndex].notes = convertedNotes;
            console.log('📝 准备保存的数据:', JSON.stringify(this.customLevels));
            
            this.saveCustomLevelsToStorage();
            console.log('📝 已保存到localStorage');
            
            // 立即更新UI
            this.displayCustomLevels();
            this.updateTimeline();
            this.updateEditorInfo();
            this.updateMainKeyboardDisplay();
            
            console.log('✅ 关卡保存成功！');
            this.status.textContent = `✅ 关卡「${this.customLevels[levelIndex].name}」已保存！`;
        } else {
            console.error('❌ 未找到当前编辑的关卡');
            this.status.textContent = '❌ 保存失败：未找到当前编辑的关卡';
        }
    }

    loadCustomLevels() {
        console.log('🔄 loadCustomLevels 被调用');
        
        if (this.currentUser) {
            // 如果已登录，从用户账户加载
            console.log('🔄 从用户账户加载自定义关卡');
            const users = this.getUsers();
            if (users[this.currentUser.username] && users[this.currentUser.username].customLevels) {
                this.customLevels = users[this.currentUser.username].customLevels;
            } else {
                this.customLevels = [];
            }
        } else {
            // 未登录，从全局 localStorage 加载
            const saved = localStorage.getItem('melodyMemoryLevels');
            console.log('🔄 localStorage 中的数据:', saved);
            this.customLevels = saved ? JSON.parse(saved) : [];
        }
        
        console.log('🔄 加载后 customLevels:', JSON.stringify(this.customLevels));
        this.displayCustomLevels();
    }

    saveCustomLevelsToStorage() {
        if (this.currentUser) {
            // 如果已登录，保存到用户账户
            const users = this.getUsers();
            if (users[this.currentUser.username]) {
                users[this.currentUser.username].customLevels = this.customLevels;
                this.saveUsers(users);
                // 同时更新当前用户对象
                this.currentUser.customLevels = this.customLevels;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
        } else {
            // 未登录，保存到全局 localStorage
            localStorage.setItem('melodyMemoryLevels', JSON.stringify(this.customLevels));
        }
    }

    displayCustomLevels() {
        console.log('📋 displayCustomLevels 被调用');
        console.log('📋 customLevels:', JSON.stringify(this.customLevels));
        console.log('📋 currentEditingLevelId:', this.currentEditingLevelId);
        
        const customLevelsContainer = document.getElementById('custom-levels');
        if (this.customLevels.length === 0) {
            customLevelsContainer.innerHTML = '<p class="empty">暂无关卡，点击新建开始创作！</p>';
            return;
        }

        customLevelsContainer.innerHTML = '';

        this.customLevels.forEach(level => {
            const totalNotes = level.notes.reduce ? level.notes.reduce((sum, item) => sum + (item.notes ? item.notes.length : 1), 0) : level.notes.length;
            const item = document.createElement('div');
            item.className = 'level-item';
            item.dataset.levelId = level.id;
            if (this.currentEditingLevelId === level.id) {
                item.classList.add('editing');
            }
            
            item.innerHTML = `
                <span class="level-name">${level.name}</span>
                <span class="level-notes">${totalNotes} 个音符</span>
                <button class="practice-level-btn" data-id="${level.id}">🎯</button>
                <button class="delete-level-btn" data-id="${level.id}">🗑️</button>
            `;
            
            // 点击整个关卡项进行编辑（更灵敏）
            item.addEventListener('click', (e) => {
                // 检查是否点击的是按钮
                if (e.target.classList.contains('practice-level-btn') || 
                    e.target.classList.contains('delete-level-btn')) {
                    return;
                }
                console.log('📋 点击关卡:', level.name);
                this.editCustomLevel(level);
            });
            
            // 练习按钮
            const practiceBtn = item.querySelector('.practice-level-btn');
            practiceBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.practiceCustomLevel(level);
            });
            
            // 删除按钮
            const deleteBtn = item.querySelector('.delete-level-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteCustomLevel(level.id);
            });
            
            customLevelsContainer.appendChild(item);
        });
    }
    
    practiceCustomLevel(level) {
        // 切换到练习模式
        this.switchMode('lesson');
        
        // 将关卡数据转换为时间轴格式
        this.recordedSequence = [];
        let absoluteTime = 0;
        level.notes.forEach(item => {
            absoluteTime += item.time;
            this.recordedSequence.push({
                time: absoluteTime,
                notes: [...item.notes]
            });
        });
        
        // 重置练习索引
        this.lessonCurrentIndex = 0;
        
        // 更新时间轴显示
        this.updateTimeline();
        this.updateEditorInfo();
        
        this.status.textContent = `🎯 练习「${level.name}」：按时间轴高亮的音符演奏！`;
    }

    playCustomLevel(level) {
        this.switchMode('play');
        this.sequence = [...level.notes];
        this.status.textContent = `🎵 正在演奏「${level.name}」，请记住旋律！`;
        this.showSequence();
    }

    editCustomLevel(level) {
        console.log('✏️ editCustomLevel 被调用');
        console.log('✏️ level:', JSON.stringify(level));
        
        // 切换到编辑模式
        this.switchMode('edit');
        
        // 设置当前编辑的关卡ID
        this.currentEditingLevelId = level.id;
        
        // 将保存的相对时间数据转换为绝对时间
        this.recordedSequence = [];
        let absoluteTime = 0;
        
        console.log('✏️ level.notes:', JSON.stringify(level.notes));
        
        if (level.notes && level.notes.length > 0) {
            level.notes.forEach((item, index) => {
                absoluteTime += item.time;
                this.recordedSequence.push({
                    time: absoluteTime,
                    notes: [...item.notes]
                });
            });
        }
        
        console.log('✏️ 转换后的 recordedSequence:', JSON.stringify(this.recordedSequence));
        
        // 取消选中节点
        this.selectedTimelineNode = null;
        
        // 更新时间轴显示（即使是空的也要更新）
        this.updateTimeline();
        this.updateEditorInfo();
        this.updateMainKeyboardDisplay();
        
        // 选中最后一个节点
        if (this.recordedSequence.length > 0) {
            this.selectTimelineNode(this.recordedSequence.length - 1);
        }
        
        // 更新关卡列表显示（高亮当前编辑的关卡）
        this.displayCustomLevels();
        
        this.status.textContent = `✏️ 已加载「${level.name}」到编辑器，可以继续编辑！`;
    }

    deleteCustomLevel(levelId) {
        const level = this.customLevels.find(l => l.id === levelId);
        if (!level) return;
        
        if (!confirm(`确定删除「${level.name}」吗？`)) return;
        
        this.customLevels = this.customLevels.filter(l => l.id !== levelId);
        this.saveCustomLevelsToStorage();
        
        // 如果删除的是当前编辑的关卡，清空时间轴
        if (this.currentEditingLevelId === levelId) {
            this.currentEditingLevelId = null;
            this.recordedSequence = [];
            this.selectedTimelineNode = null;
            this.updateTimeline();
            this.updateEditorInfo();
            this.updateMainKeyboardDisplay();
        }
        
        // 立即更新UI
        this.displayCustomLevels();
        this.status.textContent = `🗑️ 关卡「${level.name}」已删除！`;
        console.log('🗑️ 删除关卡:', level.name);
    }

    loadLesson() {
        const lessonKey = document.getElementById('lesson-select').value;
        const lesson = this.lessons[lessonKey];

        if (lesson) {
            // 切换到练习模式
            this.switchMode('lesson');
            
            // 将课程数据转换为时间轴格式
            this.recordedSequence = [];
            let time = 0;
            lesson.notes.forEach(item => {
                if (item.notes) {
                    this.recordedSequence.push({
                        time: time,
                        notes: [...item.notes]
                    });
                } else {
                    this.recordedSequence.push({
                        time: time,
                        notes: [item]
                    });
                }
                time += 500; // 每个节点间隔500ms
            });
            
            // 重置练习索引
            this.lessonCurrentIndex = 0;
            
            // 更新时间轴显示
            this.updateTimeline();
            this.updateEditorInfo();
            
            this.lessonInfo.textContent = `已加载：${lesson.name} (${lesson.notes.length} 个音符)`;
            this.status.textContent = `📚 练习模式：按时间轴高亮的音符演奏！`;
        }
    }

    async loadHighScore() {
        this.highScore = parseInt(localStorage.getItem('melodyMemoryHighScore') || '0');
    }

    updateDisplay() {
        this.levelDisplay.textContent = this.level;
        this.scoreDisplay.textContent = this.score;
        this.highScoreDisplay.textContent = this.highScore;
    }

    startGame() {
        if (this.isPlaying) return;

        if (this.currentMode === 'edit' && this.recordedSequence.length > 0) {
            this.status.textContent = '⚠️ 编辑模式下请点击「播放」按钮试听录制的旋律！如需游戏，请先保存关卡。';
            return;
        } else if (this.currentMode === 'lesson') {
            this.loadLesson();
            return;
        }

        this.isPlaying = true;
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        this.currentPlayingNode = 0;
        this.currentNodePressedNotes = new Set();
        this.updateDisplay();
        this.disableKeys();

        this.status.textContent = '准备好！聆听旋律...';
        this.status.className = 'game-status waiting';

        setTimeout(() => this.addNoteAndShow(), 500);
    }

    resetGame() {
        this.isPlaying = false;
        this.isShowingSequence = false;
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.score = 0;
        this.currentPlayingNode = 0;
        this.currentNodePressedNotes = new Set();
        this.lessonCurrentIndex = 0;
        this.lessonPressedNotes = new Set();
        this.updateDisplay();
        this.enableKeys();
        this.status.textContent = '🎮 点击「开始游戏」按钮开始挑战！';
        this.status.className = 'game-status';
    }

    addNoteAndShow() {
        // 只选择白键音符（不包含半音）
        const allNotes = Object.keys(this.noteFrequencies);
        const whiteKeys = allNotes.filter(note => !note.includes('#'));
        const randomNote = whiteKeys[Math.floor(Math.random() * whiteKeys.length)];
        this.sequence.push(randomNote);
        // 重置玩家序列，准备新的挑战
        this.playerSequence = [];
        this.showSequence();
    }

    async showSequence() {
        this.isShowingSequence = true;
        this.disableKeys();
        this.status.textContent = '🎵 仔细聆听...';
        this.status.className = 'game-status waiting';

        await this.delay(500);

        const hasRhythm = this.sequence.length > 0 && typeof this.sequence[0] === 'object';
        
        if (hasRhythm) {
            for (let i = 0; i < this.sequence.length; i++) {
                const item = this.sequence[i];
                const delayTime = i === 0 ? 200 : item.time;
                await this.delay(delayTime);
                
                const keysToActivate = [];
                item.notes.forEach(note => {
                    // 只给主键盘添加高亮，不影响时间轴节点内的小键盘
                    const key = document.querySelector(`.piano-key[data-note="${note}"]`);
                    if (key) {
                        // 纯听模式：只有声音，没有视觉反馈
                        if (this.currentMode !== 'listen') {
                            key.classList.add('active');
                            keysToActivate.push(key);
                        }
                        this.playSound(note, 500);
                    }
                });
                
                await this.delay(350);
                keysToActivate.forEach(key => key.classList.remove('active'));
            }
        } else {
            for (let i = 0; i < this.sequence.length; i++) {
                const note = this.sequence[i];
                // 只给主键盘添加高亮，不影响时间轴节点内的小键盘
                const key = document.querySelector(`.piano-key[data-note="${note}"]`);

                if (key) {
                    // 纯听模式：只有声音，没有视觉反馈
                    if (this.currentMode !== 'listen') {
                        key.classList.add('active');
                    }
                    this.playSound(note, 500);
                    await this.delay(400);
                    if (this.currentMode !== 'listen') {
                        key.classList.remove('active');
                    }
                    await this.delay(150);
                }
            }
        }

        this.isShowingSequence = false;
        this.enableKeys();
        
        const totalNotes = hasRhythm ? this.sequence.reduce((sum, item) => sum + item.notes.length, 0) : this.sequence.length;
        
        // 所有模式都只显示音符数量，不提前显示答案
        this.status.textContent = `🎹 请演奏相同的旋律！(共 ${totalNotes} 个音符)`;
        this.status.className = 'game-status';
    }

    handleKeyClick(key) {
        const note = key.dataset.note;
        
        // 获取键盘对应键名（与handleKeyboard中的映射一致）
        const keyNames = {
            'C5': 'Q', 'D5': 'W', 'E5': 'E', 'F5': 'R', 'G5': 'T', 'A5': 'Y', 'B5': 'U',
            'C4': 'A', 'D4': 'S', 'E4': 'D', 'F4': 'F', 'G4': 'G', 'A4': 'H', 'B4': 'J',
            'C3': 'Z', 'D3': 'X', 'E3': 'C', 'F3': 'V', 'G3': 'B', 'A3': 'N', 'B3': 'M'
        };
        
        // 练习模式：完全独立处理，不受编辑模式影响
        if (this.currentMode === 'lesson' && this.recordedSequence.length > 0) {
            // 确保初始化
            if (this.lessonCurrentIndex === undefined || this.lessonCurrentIndex === null) {
                this.lessonCurrentIndex = 0;
            }
            
            const currentNode = this.recordedSequence[this.lessonCurrentIndex];
            
            if (!currentNode) {
                return;
            }
            
            // 初始化已按的音符集合
            if (!this.lessonPressedNotes) {
                this.lessonPressedNotes = new Set();
            }
            
            // 检查是否按下了当前节点中的一个音符
            if (currentNode.notes.includes(note)) {
                // 只有当这个音符在当前节点中还没被按过时才播放声音
                if (!this.lessonPressedNotes.has(note)) {
                    // 播放声音
                    key.classList.add('clicked');
                    this.playSound(note, 300);
                    setTimeout(() => key.classList.remove('clicked'), 250);
                }
                
                // 添加到已按集合
                this.lessonPressedNotes.add(note);
                
                // 检查当前节点的所有音符是否都已按下
                const allPressed = currentNode.notes.every(n => this.lessonPressedNotes.has(n));
                
                if (allPressed) {
                    // 所有音符都按对了！进入下一个节点
                    this.lessonCurrentIndex++;
                    this.lessonPressedNotes = new Set(); // 重置已按集合
                    
                    // 更新时间轴和键盘高亮显示
                    this.updateTimeline();
                    this.updateMainKeyboardDisplay();
                    
                    if (this.lessonCurrentIndex >= this.recordedSequence.length) {
                        // 练习完成
                        this.status.textContent = '🎉 练习完成！';
                        this.lessonCurrentIndex = 0;
                        // 清除高亮
                        this.updateMainKeyboardDisplay();
                    } else {
                        const nextNotes = this.recordedSequence[this.lessonCurrentIndex].notes;
                        const nextKeyNames = nextNotes.map(n => keyNames[n] || n).join(', ');
                        this.status.textContent = `✅ 正确！继续第 ${this.lessonCurrentIndex + 1} 个节点 (${nextKeyNames})`;
                    }
                }
            }
            // 按错不做任何反应
            return;
        }

        // 编辑模式：播放声音和显示按键反馈
        if (this.currentMode === 'edit') {
            key.classList.add('clicked');
            this.playSound(note, 300);
            setTimeout(() => key.classList.remove('clicked'), 250);
            return;
        }

        // 记忆挑战模式：需要isPlaying状态
        if (!this.isPlaying || this.isShowingSequence) return;

        // 记忆挑战模式显示按键反馈
        key.classList.add('clicked');
        this.playSound(note, 350);
        setTimeout(() => key.classList.remove('clicked'), 280);

        // 简化的顺序记忆逻辑：按顺序检查每个音符
        const currentIndex = this.playerSequence.length;
        
        // 检查当前按下的音符是否正确
        if (note !== this.sequence[currentIndex]) {
            // 错误！游戏结束，显示正确答案
            this.gameOver();
            return;
        }

        // 正确！添加到玩家序列
        this.playerSequence.push(note);

        // 检查是否完成所有音符（必须所有音符都正确才能通关）
        if (this.playerSequence.length === this.sequence.length) {
            this.levelComplete();
        }
    }

    async levelComplete() {
        const baseScore = this.level * 15;
        const lengthBonus = this.sequence.length * 2;
        this.score += baseScore + lengthBonus;
        this.level++;

        this.updateDisplay();
        this.status.textContent = `🎉 太棒了！进入第 ${this.level} 关！`;
        this.status.className = 'game-status success';

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('melodyMemoryHighScore', this.highScore.toString());
            this.updateDisplay();
        }

        await this.delay(1500);

        this.status.textContent = '准备好！聆听下一段旋律...';
        this.status.className = 'game-status waiting';
        this.addNoteAndShow();
    }

    gameOver() {
        this.isPlaying = false;
        this.disableKeys();

        // 获取键盘对应键名（与handleKeyboard中的映射一致）
        const keyNames = {
            'C5': 'Q', 'D5': 'W', 'E5': 'E', 'F5': 'R', 'G5': 'T', 'A5': 'Y', 'B5': 'U',
            'C4': 'A', 'D4': 'S', 'E4': 'D', 'F4': 'F', 'G4': 'G', 'A4': 'H', 'B4': 'J',
            'C3': 'Z', 'D3': 'X', 'E3': 'C', 'F3': 'V', 'G3': 'B', 'A3': 'N', 'B3': 'M'
        };
        
        // 显示正确答案（只显示键盘对应键名，按顺序用空格分隔）
        const correctSequence = this.sequence.map(item => {
            // 处理对象数组格式（如 {time: 0, notes: ['C5']}）
            if (item && item.notes) {
                return item.notes.map(n => keyNames[n] || n).join('+');
            }
            // 处理简单字符串格式（如 'C5'）
            return keyNames[item] || item;
        }).join(' → ');
        
        this.status.textContent = `💔 游戏结束！正确答案：[${correctSequence}]`;
        this.status.className = 'game-status error';

        if (this.score > parseInt(localStorage.getItem('melodyMemoryHighScore') || '0')) {
            this.highScore = this.score;
            localStorage.setItem('melodyMemoryHighScore', this.highScore.toString());
            this.updateDisplay();
        }

        setTimeout(() => {
            this.showModal();
        }, 1500);
    }

    showModal() {
        this.finalScoreSpan.textContent = `${this.score} 分`;
        this.finalLevelSpan.textContent = `第 ${this.level} 关`;
        this.playerNameInput.value = '';
        this.modal.classList.add('show');
    }

    closeModal() {
        this.modal.classList.remove('show');
    }

    saveScore() {
        const playerName = this.playerNameInput.value.trim() || '匿名演奏家';
        const localScores = localStorage.getItem('melodyMemoryLeaderboard');
        const scores = localScores ? JSON.parse(localScores) : [];

        scores.push({
            player_name: playerName,
            score: this.score,
            level: this.level,
            created_at: new Date().toISOString()
        });

        scores.sort((a, b) => b.score - a.score);
        const topScores = scores.slice(0, 10);

        localStorage.setItem('melodyMemoryLeaderboard', JSON.stringify(topScores));

        this.loadLeaderboard();
        this.status.textContent = '✅ 分数已保存！';
        this.status.className = 'game-status success';
        this.closeModal();
    }

    loadLeaderboard() {
        const localScores = localStorage.getItem('melodyMemoryLeaderboard');
        const scores = localScores ? JSON.parse(localScores) : [];
        this.displayLeaderboard(scores);
    }

    displayLeaderboard(scores) {
        if (scores.length === 0) {
            this.leaderboardList.innerHTML = '<p class="empty">暂无记录，快来挑战吧！</p>';
            return;
        }

        this.leaderboardList.innerHTML = '';
        scores.forEach((score, index) => {
            const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'other';
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.innerHTML = `
                <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
                <div class="leaderboard-info">
                    <span class="leaderboard-name">${score.player_name}</span>
                    <span class="leaderboard-meta">第 ${score.level} 关</span>
                </div>
                <span class="leaderboard-score">${score.score}</span>
            `;
            this.leaderboardList.appendChild(item);
        });
    }

    enableKeys() {
        this.pianoKeys.forEach(key => {
            key.style.pointerEvents = 'auto';
            key.style.opacity = '1';
        });
    }

    disableKeys() {
        this.pianoKeys.forEach(key => {
            key.style.pointerEvents = 'none';
            key.style.opacity = '0.7';
        });
    }

    // 时间轴编辑器方法
    updateTimeline() {
        this.timelineNodes.innerHTML = '';
        
        if (this.recordedSequence.length === 0) {
            this.timelineNodes.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:20px;">暂无时间节点，点击下方按钮添加或录制旋律</p>';
            return;
        }
        
        this.recordedSequence.forEach((item, index) => {
            const node = document.createElement('div');
            node.className = 'timeline-node';
            
            // 练习模式：高亮当前需要按的节点
            if (this.currentMode === 'lesson' && this.lessonCurrentIndex === index) {
                node.classList.add('lesson-current');
            }
            
            node.dataset.index = index;
            node.draggable = true;
            
            node.innerHTML = `
                <div class="timeline-node-preview">
                    <div class="timeline-node-row">
                        <div class="timeline-node-key high" data-note="C5"></div>
                        <div class="timeline-node-key high" data-note="D5"></div>
                        <div class="timeline-node-key high" data-note="E5"></div>
                        <div class="timeline-node-key high" data-note="F5"></div>
                        <div class="timeline-node-key high" data-note="G5"></div>
                        <div class="timeline-node-key high" data-note="A5"></div>
                        <div class="timeline-node-key high" data-note="B5"></div>
                    </div>
                    <div class="timeline-node-row">
                        <div class="timeline-node-key mid" data-note="C4"></div>
                        <div class="timeline-node-key mid" data-note="D4"></div>
                        <div class="timeline-node-key mid" data-note="E4"></div>
                        <div class="timeline-node-key mid" data-note="F4"></div>
                        <div class="timeline-node-key mid" data-note="G4"></div>
                        <div class="timeline-node-key mid" data-note="A4"></div>
                        <div class="timeline-node-key mid" data-note="B4"></div>
                    </div>
                    <div class="timeline-node-row">
                        <div class="timeline-node-key low" data-note="C3"></div>
                        <div class="timeline-node-key low" data-note="D3"></div>
                        <div class="timeline-node-key low" data-note="E3"></div>
                        <div class="timeline-node-key low" data-note="F3"></div>
                        <div class="timeline-node-key low" data-note="G3"></div>
                        <div class="timeline-node-key low" data-note="A3"></div>
                        <div class="timeline-node-key low" data-note="B3"></div>
                    </div>
                </div>
                <div class="timeline-node-time">${item.time}ms</div>
                <div class="timeline-node-delete" data-index="${index}">🗑️ 删除</div>
            `;
            
            const keys = node.querySelectorAll('.timeline-node-key');
            keys.forEach(key => {
                if (item.notes.includes(key.dataset.note)) {
                    key.classList.add('active');
                }
                // 移除点击修改功能，避免误触
                key.style.pointerEvents = 'none';
            });
            
            node.addEventListener('click', () => this.selectTimelineNode(index));
            node.querySelector('.timeline-node-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteTimelineNodeByIndex(index);
            });
            
            // 拖放事件
            node.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index.toString());
                node.classList.add('dragging');
            });
            
            node.addEventListener('dragend', () => {
                node.classList.remove('dragging');
            });
            
            node.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            
            node.addEventListener('drop', (e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = index;
                if (fromIndex !== toIndex) {
                    this.reorderTimelineNodes(fromIndex, toIndex);
                }
            });
            
            this.timelineNodes.appendChild(node);
        });
        
        if (this.selectedTimelineNode !== null) {
            const selectedNode = this.timelineNodes.querySelector(`[data-index="${this.selectedTimelineNode}"]`);
            if (selectedNode) {
                selectedNode.classList.add('selected');
            }
        }
    }
    
    reorderTimelineNodes(fromIndex, toIndex) {
        // 获取要移动的节点
        const [movedItem] = this.recordedSequence.splice(fromIndex, 1);
        
        // 插入到新位置
        this.recordedSequence.splice(toIndex, 0, movedItem);
        
        // 调整时间，保持相对间隔
        if (this.recordedSequence.length > 0) {
            // 第一个节点时间设为0
            this.recordedSequence[0].time = 0;
            
            // 后续节点时间 = 前一个节点时间 + 固定间隔
            for (let i = 1; i < this.recordedSequence.length; i++) {
                const prevItem = this.recordedSequence[i-1];
                this.recordedSequence[i].time = prevItem.time + 500;
            }
        }
        
        // 更新选中状态
        this.selectedTimelineNode = toIndex;
        
        // 刷新显示
        this.updateTimeline();
        this.updateEditorInfo();
    }
    
    selectTimelineNode(index) {
        document.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('selected'));
        const node = this.timelineNodes.querySelector(`[data-index="${index}"]`);
        if (node) {
            node.classList.add('selected');
            this.selectedTimelineNode = index;
        }
        
        // 练习模式：点击时间轴节点时同步更新当前练习节点
        if (this.currentMode === 'lesson') {
            this.lessonCurrentIndex = index;
            this.lessonPressedNotes = new Set(); // 重置已按集合
            // 更新状态提示
            const currentNode = this.recordedSequence[this.lessonCurrentIndex];
            if (currentNode) {
                const keyNames = {
                    'C6': 'Q', 'D6': 'W', 'E6': 'E', 'F6': 'R', 'G6': 'T', 'A6': 'Y', 'B6': 'U',
                    'C5': 'A', 'D5': 'S', 'E5': 'D', 'F5': 'F', 'G5': 'G', 'A5': 'H', 'B5': 'J',
                    'C4': 'Z', 'D4': 'X', 'E4': 'C', 'F4': 'V', 'G4': 'B', 'A4': 'N', 'B4': 'M'
                };
                const noteNames = currentNode.notes.map(n => keyNames[n] || n).join(', ');
                this.status.textContent = `📚 练习第 ${this.lessonCurrentIndex + 1} 个节点 (${noteNames})`;
            }
        }
        
        // 更新主键盘显示该节点的音符状态
        this.updateMainKeyboardDisplay();
    }
    
    updateMainKeyboardDisplay() {
        // 清除所有主键盘的active状态
        this.pianoKeys.forEach(key => {
            key.classList.remove('active', 'lesson-hint');
        });
        
        // 练习模式：高亮显示当前需要按下的音符（优先级最高）
        if (this.currentMode === 'lesson' && this.lessonCurrentIndex !== undefined && this.recordedSequence[this.lessonCurrentIndex]) {
            const currentNode = this.recordedSequence[this.lessonCurrentIndex];
            currentNode.notes.forEach(note => {
                const key = document.querySelector(`.piano-key[data-note="${note}"]`);
                if (key) {
                    key.classList.add('lesson-hint');
                }
            });
            // 练习模式下不显示编辑模式的选中状态
            return;
        }
        
        // 编辑模式：如果选中了时间轴节点，显示该节点的音符
        if (this.currentMode === 'edit' && this.selectedTimelineNode !== null && this.recordedSequence[this.selectedTimelineNode]) {
            const nodeData = this.recordedSequence[this.selectedTimelineNode];
            nodeData.notes.forEach(note => {
                const key = document.querySelector(`.piano-key[data-note="${note}"]`);
                if (key) {
                    key.classList.add('active');
                }
            });
        }
    }
    
    editTimelineNodeNote(nodeIndex, note) {
        const item = this.recordedSequence[nodeIndex];
        if (!item) return;
        
        const noteIndex = item.notes.indexOf(note);
        if (noteIndex > -1) {
            // 如果音符已存在，则删除
            item.notes.splice(noteIndex, 1);
        } else {
            // 如果音符不存在，则添加
            item.notes.push(note);
        }
        
        this.updateMainKeyboardDisplay();
        this.updateTimeline();
        this.updateEditorInfo();
    }
    
    toggleTimelineNodeNote(index, note) {
        const item = this.recordedSequence[index];
        if (!item) return;
        
        const noteIndex = item.notes.indexOf(note);
        if (noteIndex > -1) {
            item.notes.splice(noteIndex, 1);
            if (item.notes.length === 0) {
                this.recordedSequence.splice(index, 1);
                
                // 自动选中下一个节点
                if (this.recordedSequence.length > 0) {
                    if (index < this.recordedSequence.length) {
                        this.selectedTimelineNode = index;
                    } else {
                        this.selectedTimelineNode = this.recordedSequence.length - 1;
                    }
                } else {
                    this.selectedTimelineNode = null;
                }
            }
        } else {
            item.notes.push(note);
        }
        
        this.updateTimeline();
        this.updateMainKeyboardDisplay();
        this.updateEditorInfo();
    }
    
    addTimelineNode() {
        // 获取当前选中的音符时值（默认四分音符）
        const noteValues = {
            quarter: 500,    // 四分音符 = 500ms
            eighth: 250,     // 八分音符 = 250ms
            sixteenth: 125   // 十六分音符 = 125ms
        };
        
        const currentNoteValue = this.currentNoteValue || 'quarter';
        const noteDuration = noteValues[currentNoteValue];
        
        let insertIndex, newTime;
        
        if (this.selectedTimelineNode !== null && this.selectedTimelineNode < this.recordedSequence.length) {
            // 如果有选中节点，插入到选中节点之后
            insertIndex = this.selectedTimelineNode + 1;
            const prevTime = this.recordedSequence[this.selectedTimelineNode].time;
            newTime = prevTime + noteDuration;
            
            // 后面的所有节点时间都增加当前音符时值
            for (let i = insertIndex; i < this.recordedSequence.length; i++) {
                this.recordedSequence[i].time += noteDuration;
            }
        } else {
            // 如果没有选中节点，添加到末尾
            insertIndex = this.recordedSequence.length;
            newTime = this.recordedSequence.length > 0 
                ? this.recordedSequence[this.recordedSequence.length - 1].time + noteDuration 
                : 0;
        }
        
        this.recordedSequence.splice(insertIndex, 0, {
            time: newTime,
            notes: [],
            duration: noteDuration
        });
        
        this.updateTimeline();
        this.updateEditorInfo();
        this.selectTimelineNode(insertIndex);
    }
    
    deleteTimelineNode() {
        if (this.selectedTimelineNode === null) {
            alert('请先选择一个时间节点！');
            return;
        }
        
        const oldIndex = this.selectedTimelineNode;
        const deletedNode = this.recordedSequence[oldIndex];
        
        // 删除节点
        this.recordedSequence.splice(this.selectedTimelineNode, 1);
        
        // 只有手动添加的节点（有duration属性）才调整后面节点的时间
        if (deletedNode.duration && oldIndex < this.recordedSequence.length) {
            const deletedDuration = deletedNode.duration;
            for (let i = oldIndex; i < this.recordedSequence.length; i++) {
                this.recordedSequence[i].time -= deletedDuration;
            }
        }
        
        // 更新选中的节点
        if (this.recordedSequence.length > 0) {
            if (oldIndex < this.recordedSequence.length) {
                this.selectedTimelineNode = oldIndex;
            } else {
                this.selectedTimelineNode = this.recordedSequence.length - 1;
            }
        } else {
            this.selectedTimelineNode = null;
        }
        
        this.updateTimeline();
        this.updateMainKeyboardDisplay();
        this.updateEditorInfo();
    }
    
    deleteTimelineNodeByIndex(index) {
        const deletedNode = this.recordedSequence[index];
        
        this.recordedSequence.splice(index, 1);
        
        // 只有手动添加的节点（有duration属性）才调整后面节点的时间
        if (deletedNode.duration && index < this.recordedSequence.length) {
            const deletedDuration = deletedNode.duration;
            for (let i = index; i < this.recordedSequence.length; i++) {
                this.recordedSequence[i].time -= deletedDuration;
            }
        }
        
        if (this.recordedSequence.length > 0) {
            if (index < this.recordedSequence.length) {
                this.selectedTimelineNode = index;
            } else {
                this.selectedTimelineNode = this.recordedSequence.length - 1;
            }
        } else {
            this.selectedTimelineNode = null;
        }
        
        this.updateTimeline();
        this.updateMainKeyboardDisplay();
        this.updateEditorInfo();
    }
    
    toggleTimelinePlay() {
        if (this.recordedSequence.length === 0) {
            alert('请先添加时间节点！');
            return;
        }
        
        // 如果正在播放，暂停
        if (this.timelinePlaying) {
            this.pauseTimeline();
            return;
        }
        
        // 每次播放都从选中的节点开始（或从头开始）
        this.timelinePlaying = true;
        this.timelinePaused = false;
        this.timelineCurrentIndex = this.selectedTimelineNode !== null ? this.selectedTimelineNode : 0;
        this.playTimelineNode(this.timelineCurrentIndex);
        
        // 更新按钮显示
        if (this.timelinePlayBtn) {
            this.timelinePlayBtn.textContent = '⏸️ 暂停';
        }
    }
    
    playTimelineNode(index) {
        if (!this.timelinePlaying || index >= this.recordedSequence.length) {
            this.stopTimeline();
            return;
        }
        
        const item = this.recordedSequence[index];
        const prevItem = index > 0 ? this.recordedSequence[index - 1] : null;
        const delayTime = prevItem ? item.time - prevItem.time : 500;
        
        setTimeout(() => {
            if (!this.timelinePlaying) return;
            
            this.selectTimelineNode(index);
            
            item.notes.forEach(note => {
                // 只给主键盘添加高亮，不影响时间轴节点内的小键盘
                const key = document.querySelector(`.piano-key[data-note="${note}"]`);
                if (key) {
                    key.classList.add('active');
                    this.playSound(note, 500);
                    setTimeout(() => key.classList.remove('active'), 400);
                }
            });
            
            this.timelineCurrentIndex++;
            this.playTimelineNode(this.timelineCurrentIndex);
        }, delayTime);
    }
    
    pauseTimeline() {
        this.timelinePlaying = false;
        this.timelinePaused = true;
        // 更新按钮显示
        if (this.timelinePlayBtn) {
            this.timelinePlayBtn.textContent = '▶️ 播放';
        }
    }
    
    stopTimeline() {
        this.timelinePlaying = false;
        this.timelinePaused = false;
        // 更新按钮显示
        if (this.timelinePlayBtn) {
            this.timelinePlayBtn.textContent = '▶️ 播放';
        }
        this.timelineCurrentIndex = 0;
        
        // 同时停止录制
        if (this.isRecording) {
            this.isRecording = false;
            this.timelineRecordBtn.textContent = '🔴 录制';
            this.timelineRecordBtn.style.background = '';
        }
        
        document.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('selected'));
        this.selectedTimelineNode = null;
    }
    
    updateTimelineTime(time) {
        const seconds = Math.floor(time / 1000);
        const milliseconds = time % 1000;
        this.timelineTime.textContent = `${seconds}:${milliseconds.toString().padStart(3, '0')}`;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==================== 登录相关方法 ====================
    
    // 检查自动登录
    checkAutoLogin() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showUserInfo();
        }
    }

    // 获取所有用户
    getUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : {};
    }

    // 保存用户
    saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // 注册
    register() {
        const username = this.loginUsername.value.trim();
        const password = this.loginPassword.value;

        if (!username) {
            alert('请输入用户名');
            return;
        }
        if (!password) {
            alert('请输入密码');
            return;
        }

        const users = this.getUsers();

        if (users[username]) {
            alert('该用户名已存在');
            return;
        }

        // 注册新用户
        users[username] = {
            password: password, // 简单存储，实际应用应加密
            highScore: 0,
            customLevels: [],
            createdAt: new Date().toISOString()
        };

        this.saveUsers(users);
        alert('注册成功！请登录');
        this.loginUsername.value = '';
        this.loginPassword.value = '';
    }

    // 登录
    login() {
        const username = this.loginUsername.value.trim();
        const password = this.loginPassword.value;

        if (!username) {
            alert('请输入用户名');
            return;
        }
        if (!password) {
            alert('请输入密码');
            return;
        }

        const users = this.getUsers();

        if (!users[username]) {
            alert('用户名不存在');
            return;
        }

        if (users[username].password !== password) {
            alert('密码错误');
            return;
        }

        // 登录成功
        this.currentUser = {
            username: username,
            ...users[username]
        };

        // 保存当前登录状态
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // 更新最高分
        if (this.currentUser.highScore > this.highScore) {
            this.highScore = this.currentUser.highScore;
            localStorage.setItem('highScore', this.highScore.toString());
            this.updateDisplay();
        }

        // 重置编辑状态：不清空时间轴，但切换到非编辑模式
        this.stopTimeline(); // 停止播放
        this.isRecording = false; // 停止录制
        this.recordedSequence = []; // 清空录制序列
        this.selectedTimelineNode = null; // 取消选中节点
        this.currentEditingLevelId = null; // 清除当前编辑的关卡ID
        
        // 重置时间轴显示
        this.updateTimeline();
        this.updateEditorInfo();
        
        // 重置钢琴键盘高亮
        this.pianoKeys.forEach(key => key.classList.remove('active'));
        
        // 切换到演奏模式
        this.switchMode('play');
        
        // 加载用户的自定义关卡
        this.loadCustomLevels();
        
        this.showUserInfo();
        this.loginUsername.value = '';
        this.loginPassword.value = '';
        
        // 更新状态显示
        this.status.textContent = `🎮 演奏模式 - 点击开始按钮开始游戏！`;
        
        alert(`欢迎回来，${username}！`);
    }

    // 退出登录
    logout() {
        // 停止任何播放或录制
        this.stopTimeline();
        this.isRecording = false;
        this.recordedSequence = [];
        this.selectedTimelineNode = null;
        this.currentEditingLevelId = null;
        
        // 重置时间轴显示
        this.updateTimeline();
        this.updateEditorInfo();
        
        // 重置钢琴键盘高亮
        this.pianoKeys.forEach(key => key.classList.remove('active'));
        
        // 切换到演奏模式
        this.switchMode('play');
        
        // 清除用户数据
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        
        // 清空自定义关卡列表（不保存到服务器）
        this.customLevels = [];
        
        // 立即更新关卡列表显示
        this.displayCustomLevels();
        
        // 更新状态显示
        this.status.textContent = `🎮 演奏模式 - 点击开始按钮开始游戏！`;
        
        // 更新用户信息显示（显示登录表单）
        this.showUserInfo();
        
        alert('已退出登录');
    }

    // 导出用户数据
    exportUserData() {
        const data = {
            users: this.getUsers(),
            currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
            customLevels: this.customLevels,
            melodyMemoryLevels: JSON.parse(localStorage.getItem('melodyMemoryLevels') || '[]'),
            melodyMemoryHighScore: localStorage.getItem('melodyMemoryHighScore'),
            melodyMemoryLeaderboard: JSON.parse(localStorage.getItem('melodyMemoryLeaderboard') || '[]')
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'piano-game-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('数据已导出！请保存下载的文件。');
    }

    // 导入用户数据
    importUserData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    // 保存数据到 localStorage
                    if (data.users) {
                        localStorage.setItem('users', JSON.stringify(data.users));
                    }
                    if (data.currentUser) {
                        localStorage.setItem('currentUser', JSON.stringify(data.currentUser));
                    }
                    if (data.customLevels) {
                        this.customLevels = data.customLevels;
                        localStorage.setItem('melodyMemoryLevels', JSON.stringify(data.customLevels));
                    }
                    if (data.melodyMemoryLevels) {
                        localStorage.setItem('melodyMemoryLevels', JSON.stringify(data.melodyMemoryLevels));
                    }
                    if (data.melodyMemoryHighScore) {
                        localStorage.setItem('melodyMemoryHighScore', data.melodyMemoryHighScore);
                    }
                    if (data.melodyMemoryLeaderboard) {
                        localStorage.setItem('melodyMemoryLeaderboard', JSON.stringify(data.melodyMemoryLeaderboard));
                    }
                    
                    // 更新当前用户
                    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
                    if (currentUser) {
                        this.currentUser = currentUser;
                    }
                    
                    alert('数据导入成功！请刷新页面。');
                } catch (error) {
                    alert('导入失败：无效的JSON文件');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    // 显示用户信息或登录表单
    showUserInfo() {
        if (this.currentUser) {
            this.userInfo.classList.remove('hidden');
            this.loginForm.style.display = 'none';
            this.usernameDisplay.textContent = this.currentUser.username;
        } else {
            this.userInfo.classList.add('hidden');
            this.loginForm.style.display = 'flex';
        }
    }

    // 保存分数到用户数据
    saveScoreToUser(score) {
        if (!this.currentUser) return;

        const users = this.getUsers();
        if (users[this.currentUser.username]) {
            if (score > users[this.currentUser.username].highScore) {
                users[this.currentUser.username].highScore = score;
                this.currentUser.highScore = score;
                this.saveUsers(users);
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            }
        }
    }
}

let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new MelodyMemoryGame();
});