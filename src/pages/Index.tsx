import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

function Index() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [users, setUsers] = useState<Record<string, {password: string, pugcoins: number}>>({});
  
  const [pugcoins, setPugcoins] = useState(100);
  const [activeSection, setActiveSection] = useState('main');
  const [crosswordAnswers, setCrosswordAnswers] = useState<Record<string, string>>({});
  const [completedCrosswords, setCompletedCrosswords] = useState<string[]>([]);
  
  // Game state
  const [gameLevel, setGameLevel] = useState(1);
  const [playerPosition, setPlayerPosition] = useState(50);
  const [gameRunning, setGameRunning] = useState(false);
  const [coins, setCoins] = useState([200, 400, 600]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  // Auth functions
  const handleLogin = () => {
    if (users[username] && users[username].password === password) {
      setIsAuthenticated(true);
      setCurrentUser(username);
      setPugcoins(users[username].pugcoins);
      setUsername('');
      setPassword('');
    } else {
      alert('Неверный логин или пароль!');
    }
  };

  const handleRegister = () => {
    if (username && password) {
      if (users[username]) {
        alert('Пользователь уже существует!');
        return;
      }
      setUsers(prev => ({
        ...prev,
        [username]: { password, pugcoins: 100 }
      }));
      setIsAuthenticated(true);
      setCurrentUser(username);
      setPugcoins(100);
      setUsername('');
      setPassword('');
    } else {
      alert('Заполните все поля!');
    }
  };

  const handleLogout = () => {
    // Save current pugcoins balance
    setUsers(prev => ({
      ...prev,
      [currentUser]: { ...prev[currentUser], pugcoins }
    }));
    setIsAuthenticated(false);
    setCurrentUser('');
    setActiveSection('main');
  };

  const regions = {
    'Центральный район': ['Мопс-Сити', 'Барклай', 'Паг-Таун'],
    'Торговый квартал': ['Булька-Базар', 'Носик-Плаза'],
    'Ушастая слобода': ['Свернутый Хвост', 'Храпово', 'Морщинкино']
  };

  const crosswordWords = [
    { id: 'word1', clue: 'Символ города', answer: 'мопс', length: 4 },
    { id: 'word2', clue: 'Главный товар на рынке', answer: 'корм', length: 4 },
    { id: 'word3', clue: 'Украшение для шеи', answer: 'ошейник', length: 8 },
    { id: 'word4', clue: 'Место торговли', answer: 'базар', length: 5 },
    { id: 'word5', clue: 'Любимая игрушка', answer: 'мячик', length: 5 },
    { id: 'word6', clue: 'Валюта города', answer: 'пагкоин', length: 7 },
    { id: 'word7', clue: 'Торговец на базаре', answer: 'купец', length: 5 },
    { id: 'word8', clue: 'Хвост мопса', answer: 'завиток', length: 7 },
    { id: 'word9', clue: 'Мера веса на базаре', answer: 'пуд', length: 3 }
  ];

  const shopItems = [
    { id: 'collar', name: 'Золотой ошейник', price: 500, icon: '🔗' },
    { id: 'toy', name: 'Царский мячик', price: 300, icon: '⚽' },
    { id: 'bowl', name: 'Хрустальная миска', price: 800, icon: '🥣' },
    { id: 'statue', name: 'Статуя мопса', price: 2000, icon: '🗿' }
  ];

  // Game controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      if (e.key === 'ArrowLeft' && playerPosition > 0) {
        setPlayerPosition(prev => Math.max(0, prev - 10));
      } else if (e.key === 'ArrowRight' && playerPosition < 700) {
        setPlayerPosition(prev => Math.min(700, prev + 10));
      }
      
      // Check coin collection
      coins.forEach((coinPos, index) => {
        if (Math.abs(playerPosition - coinPos) < 30) {
          setPugcoins(prev => prev + 50);
          setCoins(prev => prev.filter((_, i) => i !== index));
        }
      });
      
      // Check level completion
      if (playerPosition >= 680) {
        setGameRunning(false);
        if (!completedLevels.includes(gameLevel)) {
          setPugcoins(prev => prev + 100);
          setCompletedLevels(prev => [...prev, gameLevel]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameRunning, playerPosition, coins, gameLevel, completedLevels]);

  const startGame = (level: number) => {
    setGameLevel(level);
    setPlayerPosition(50);
    setGameRunning(true);
    setCoins([200, 400, 600]);
  };

  const checkCrosswordAnswer = (wordId: string, answer: string) => {
    const word = crosswordWords.find(w => w.id === wordId);
    if (word && answer.toLowerCase() === word.answer.toLowerCase()) {
      if (!completedCrosswords.includes(wordId)) {
        setPugcoins(prev => prev + 25);
        setCompletedCrosswords(prev => [...prev, wordId]);
      }
      return true;
    }
    return false;
  };

  const buyItem = (item: any) => {
    if (pugcoins >= item.price) {
      setPugcoins(prev => prev - item.price);
      alert(`Вы купили ${item.name}! 🎉`);
    } else {
      alert('Недостаточно пагкоинов! 💰');
    }
  };

  const renderAuthSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background text-foreground relative overflow-hidden cyber-grid flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-50"></div>
      
      <Card className="auth-card w-full max-w-md mx-4 relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl gradient-text pickyside-font mb-4">
            🐶 Мопс-Град Торговля 🐶
          </CardTitle>
          <p className="text-muted-foreground">Торговая площадка</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="Имя купца"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-effect pickyside-font text-center"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-effect pickyside-font text-center"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleLogin}
              className="flex-1 hover-scale neon-glow pickyside-font"
              variant="outline"
            >
              Войти
            </Button>
            <Button 
              onClick={handleRegister}
              className="flex-1 hover-scale neon-glow pickyside-font"
            >
              Зарегистрироваться
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMainSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background text-foreground relative overflow-hidden cyber-grid">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-50"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-7xl font-bold gradient-text animate-fade-in neon-glow pickyside-font">
              🐶 Мопс-Град 🐶
            </h1>
            <p className="text-lg text-muted-foreground pickyside-font">
              Торговый центр
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-6 py-3 hover-scale glass-effect neon-glow">
              <Icon name="Coins" size={24} className="mr-2 text-primary" />
              <span className="gradient-text font-bold pickyside-font">{pugcoins}</span> Пагкоинов
            </Badge>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Купец:</p>
              <p className="pickyside-font text-primary">{currentUser}</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="hover-scale neon-glow pickyside-font"
            >
              Выйти
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { id: 'history', title: 'История', icon: '📜', desc: 'Летопись города' },
            { id: 'shop', title: 'Лавка', icon: '🏪', desc: 'Товары за пагкоины' },
            { id: 'attractions', title: 'Достоприм.', icon: '🏛️', desc: 'Памятные места' },
            { id: 'quests', title: 'Задания', icon: '✨', desc: 'Заработать пагкоины' }
          ].map(section => (
            <Card 
              key={section.id}
              className="hover-scale cursor-pointer glass-effect neon-glow border-2 hover:border-primary transition-all duration-300"
              onClick={() => setActiveSection(section.id)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2 text-primary">{section.icon}</div>
                <CardTitle className="text-xl gradient-text pickyside-font">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground text-sm pickyside-font">{section.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="glass-effect neon-glow">
            <CardHeader>
              <CardTitle className="gradient-text pickyside-font">🏘️ Районы города</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveSection('cities')} 
                className="w-full hover-scale neon-glow pickyside-font"
                variant="outline"
              >
                Посмотреть районы
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect neon-glow">
            <CardHeader>
              <CardTitle className="gradient-text pickyside-font">🎮 Мопс-Игра</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveSection('game')} 
                className="w-full hover-scale neon-glow pickyside-font"
                variant="outline"
              >
                Начать игру
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderCitiesSection = () => (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => setActiveSection('main')} 
          className="mb-6 hover-scale neon-glow"
          variant="outline"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад
        </Button>
        
        <Card className="mb-6 glass-effect neon-glow">
          <CardHeader>
            <CardTitle className="text-3xl gradient-text pickyside-font">🏛️ Районы Мопс-Града</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {Object.entries(regions).map(([region, cities]) => (
                <div key={region}>
                  <h3 className="text-2xl font-bold mb-4 text-secondary pickyside-font">{region}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cities.map(city => (
                      <Card key={city} className="hover-scale glass-effect border-primary/30">
                        <CardHeader className="text-center">
                          <CardTitle className="text-lg gradient-text pickyside-font">{city}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                          <div className="text-3xl mb-2 text-primary">🏘️</div>
                          <p className="text-sm text-muted-foreground pickyside-font">
                            Торговый район
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderGameSection = () => (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => setActiveSection('main')} 
          className="mb-6 hover-scale neon-glow"
          variant="outline"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад
        </Button>
        
        <Card className="mb-6 glass-effect neon-glow">
          <CardHeader>
            <CardTitle className="text-3xl gradient-text pickyside-font">◇ МОП-МАРИО: ТОРГОВАЯ ОДИССЕЯ</CardTitle>
            <p className="text-muted-foreground pickyside-font">
              ИСПОЛЬЗУЙ ← → СТРЕЛКИ ДЛЯ ДВИЖЕНИЯ. СОБЕРИ МОНЕТЫ И ДОСТИГНИ ФИНИША!
            </p>
          </CardHeader>
          <CardContent>
            {!gameRunning ? (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-lg mb-4 pickyside-font">ВЫБЕРИ УРОВЕНЬ:</p>
                  <div className="flex gap-4 justify-center">
                    {[1, 2, 3].map(level => (
                      <Button
                        key={level}
                        onClick={() => startGame(level)}
                        className={`hover-scale neon-glow pickyside-font ${completedLevels.includes(level) ? 'bg-green-600' : ''}`}
                        variant="outline"
                      >
                        {completedLevels.includes(level) ? '◆' : '◇'} УРОВЕНЬ {level}
                        {completedLevels.includes(level) && <span className="ml-2 text-xs">(+100 Пагкоинов)</span>}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Badge className="text-lg px-4 py-2 neon-glow pickyside-font">
                    УРОВЕНЬ {gameLevel} | МОНЕТ: {3 - coins.length}/3
                  </Badge>
                </div>
                
                <div className="relative w-full h-32 bg-gradient-to-r from-card to-muted rounded-lg border-2 border-primary overflow-hidden">
                  {/* Player */}
                  <div 
                    className="absolute bottom-2 w-8 h-8 bg-primary rounded-full transition-all duration-100 shadow-lg"
                    style={{ left: `${playerPosition}px` }}
                  >
                    ◼
                  </div>
                  
                  {/* Coins */}
                  {coins.map((pos, index) => (
                    <div 
                      key={index}
                      className="absolute bottom-12 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"
                      style={{ left: `${pos}px` }}
                    >
                      ◉
                    </div>
                  ))}
                  
                  {/* Finish line */}
                  <div className="absolute right-2 top-0 bottom-0 w-4 bg-gradient-to-t from-green-400 to-green-600 rounded">
                    ◆
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => setGameRunning(false)}
                    variant="outline"
                    className="hover-scale pickyside-font"
                  >
                    ◼ ОСТАНОВИТЬ ИГРУ
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderHistorySection = () => (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => setActiveSection('main')} 
          className="mb-6 hover-scale neon-glow"
          variant="outline"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад
        </Button>
        
        <Card className="mb-6 glass-effect neon-glow">
          <CardHeader>
            <CardTitle className="text-3xl gradient-text">🏛️ История Мопс-Града</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              В далекие времена, когда торговые пути пролегали через все земли, был основан 
              город Мопс-Град - главный торговый центр, посвященный ремеслам и торговле.
            </p>
            <p>
              Город получил свое название в честь легендарных мопсов - верных спутников купцов, 
              которые согласно древним летописям, охраняли торговые тайны и редкие товары.
            </p>
            <p>
              Сегодня Мопс-Град является центром торговли, где каждый житель - 
              мастер своего дела, а пагкоины звенят на каждом базаре.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderShopSection = () => (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => setActiveSection('main')} 
          className="mb-6 hover-scale neon-glow"
          variant="outline"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад
        </Button>
        
        <Card className="mb-6 glass-effect neon-glow">
          <CardHeader>
            <CardTitle className="text-3xl gradient-text">🏪 Торговая лавка</CardTitle>
            <p className="text-muted-foreground">
              Ваш баланс: <span className="text-primary font-bold gradient-text">{pugcoins} пагкоинов</span>
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shopItems.map(item => (
                <Card key={item.id} className="hover-scale glass-effect border-2 hover:border-primary transition-all neon-glow">
                  <CardHeader>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{item.emoji}</div>
                      <CardTitle className="text-lg gradient-text">{item.name}</CardTitle>
                      {item.limited && (
                        <Badge variant="destructive" className="mt-2 neon-glow">
                          Лимитированная версия ({item.stock} шт.)
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-2xl font-bold gradient-text mb-4">
                      {item.price.toLocaleString()} 🪙
                    </p>
                    <Button 
                      onClick={() => buyItem(item)}
                      disabled={pugcoins < item.price}
                      className="w-full hover-scale neon-glow"
                    >
                      Купить
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAttractionsSection = () => (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => setActiveSection('main')} 
          className="mb-6 hover-scale neon-glow"
          variant="outline"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад
        </Button>
        
        <Card className="mb-6 glass-effect neon-glow">
          <CardHeader>
            <CardTitle className="text-3xl gradient-text">🏛️ Достопримечательности</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Статуя Мопса Благородного', emoji: '🗽', desc: 'Каменный символ города с золотым ошейником' },
                { name: 'Музей Торгового Дела', emoji: '🏛️', desc: 'Самая большая коллекция редких товаров' },
                { name: 'Базарная площадь', emoji: '🏪', desc: 'Главное место торговли города' },
                { name: 'Мост Купеческий', emoji: '🌉', desc: 'Древний мост между торговыми районами' }
              ].map(attraction => (
                <Card key={attraction.name} className="hover-scale glass-effect neon-glow">
                  <CardHeader>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{attraction.emoji}</div>
                      <CardTitle className="gradient-text">{attraction.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">{attraction.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderQuestsSection = () => (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => setActiveSection('main')} 
          className="mb-6 hover-scale neon-glow"
          variant="outline"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад
        </Button>
        
        <Card className="mb-6 glass-effect neon-glow">
          <CardHeader>
            <CardTitle className="text-3xl gradient-text">⚡ Торговые кроссворды</CardTitle>
            <p className="text-muted-foreground">
              Решайте загадки и получайте по 25 пагкоинов за каждый правильный ответ!
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {crosswordWords.map(word => (
                <Card 
                  key={word.id} 
                  className={`hover-scale glass-effect neon-glow ${completedCrosswords.includes(word.id) ? 'border-green-500 bg-green-900/20' : ''}`}
                >
                  <CardHeader>
                    <CardTitle className="text-lg gradient-text">
                      {completedCrosswords.includes(word.id) ? '✅' : '🔮'} Слово {word.length} букв
                    </CardTitle>
                    <p className="text-muted-foreground">{word.clue}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Введите ответ"
                        value={crosswordAnswers[word.id] || ''}
                        onChange={(e) => setCrosswordAnswers(prev => ({
                          ...prev,
                          [word.id]: e.target.value
                        }))}
                        disabled={completedCrosswords.includes(word.id)}
                        className="glass-effect"
                      />
                      <Button
                        onClick={() => checkCrosswordAnswer(word.id, crosswordAnswers[word.id] || '')}
                        disabled={completedCrosswords.includes(word.id)}
                        className="hover-scale neon-glow"
                      >
                        {completedCrosswords.includes(word.id) ? '✅' : '🔍'}
                      </Button>
                    </div>
                    {completedCrosswords.includes(word.id) && (
                      <Badge variant="default" className="mt-2 neon-glow">
                        +25 лизкоинов получено!
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return renderAuthSection();
  }

  return (
    <div className="min-h-screen bg-background dark">
      {activeSection === 'main' && renderMainSection()}
      {activeSection === 'cities' && renderCitiesSection()}
      {activeSection === 'game' && renderGameSection()}
      {activeSection === 'history' && renderHistorySection()}
      {activeSection === 'shop' && renderShopSection()}
      {activeSection === 'attractions' && renderAttractionsSection()}
      {activeSection === 'quests' && renderQuestsSection()}
    </div>
  );
}

export default Index;