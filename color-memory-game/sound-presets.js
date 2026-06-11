// 音色预设配置文件
// 版本：纯净空灵游戏琴音 v1.0
// 描述：接近光遇/原神风格的琴音色

const soundPresets = {
    // 纯净空灵游戏琴音
    'game-harp': {
        name: '游戏琴音',
        description: '纯净空灵，接近光遇/原神风格',
        oscillators: [
            { type: 'sine', frequencyMultiplier: 1, gain: 0.45, decay: 1.0 },
            { type: 'sine', frequencyMultiplier: 2, gain: 0.08, decay: 0.6 }
        ],
        envelope: {
            attack: 0.005,
            decay: 0.2,
            sustain: 0.25,
            release: 0.8
        },
        filter: {
            type: 'lowpass',
            frequency: 6000
        },
        reverb: 0.2
    },
    
    // 备用：更温暖的版本
    'warm-piano': {
        name: '温暖钢琴',
        description: '更温暖圆润的音色',
        oscillators: [
            { type: 'sine', frequencyMultiplier: 1, gain: 0.5, decay: 1.2 },
            { type: 'triangle', frequencyMultiplier: 2, gain: 0.1, decay: 0.8 },
            { type: 'sine', frequencyMultiplier: 1.5, gain: 0.06, decay: 1.0 }
        ],
        envelope: {
            attack: 0.01,
            decay: 0.3,
            sustain: 0.3,
            release: 1.0
        },
        filter: {
            type: 'lowpass',
            frequency: 5000
        },
        reverb: 0.25
    }
};

// 导出供其他文件使用
if (typeof module !== 'undefined') {
    module.exports = soundPresets;
}
