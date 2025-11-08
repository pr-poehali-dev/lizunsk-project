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
  const [users, setUsers] = useState<Record<string, {password: string, lizcoin: number}>>({});
  
  const [lizcoin, setLizcoin] = useState(100);
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
      setLizcoin(users[username].lizcoin);
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
        [username]: { password, lizcoin: 100 }
      }));
      setIsAuthenticated(true);
      setCurrentUser(username);
      setLizcoin(100);
      setUsername('');
      setPassword('');
    } else {
      alert('Заполните все поля!');
    }
  };

  const handleLogout = () => {
    // Save current lizcoin balance
    setUsers(prev => ({
      ...prev,
      [currentUser]: { ...prev[currentUser], lizcoin }
    }));
    setIsAuthenticated(false);
    setCurrentUser('');
    setActiveSection('main');
  };

  const regions = {
    'Субкультурная область': ['Лизунск город', 'Готовск', 'Эмовск', 'Панквск'],
    'Мухосранская область': ['Мухосранск', 'Нижний Лизунск'],
    'Лизунская область': ['Картэльск', 'Никтовск', 'Пеневск']
  };

  const crosswordWords = [
    { id: 'word1', clue: 'Главная достопримечательность страны', answer: 'лизун', length: 5 },
    { id: 'word2', clue: 'Холодное лакомство', answer: 'мороженое', length: 9 },
    { id: 'word3', clue: 'Фруктовый лед', answer: 'сорбет', length: 6 },
    { id: 'word4', clue: 'Часть тела для объятий', answer: 'ладошка', length: 7 },
    { id: 'word5', clue: 'Летний суп', answer: 'окрошка', length: 7 },
    { id: 'word6', clue: 'Певчая птица', answer: 'соловей', length: 7 },
    { id: 'word7', clue: 'Молочное животное', answer: 'корова', length: 6 },
    { id: 'word8', clue: 'Женское имя', answer: 'лиза', length: 4 },
    { id: 'word9', clue: 'Глава государства', answer: 'президент', length: 9 }
  ];

  const shopItems = [
    { id: 'passport', name: 'GALACTIC PASSPORT', price: 500, icon: '◈' },
    { id: 'moon-passport', name: 'LUNAR ACCESS PASS', price: 50000, icon: '◉', limited: true, stock: 2 },
    { id: 'signature', name: 'PRESIDENTIAL SIGNATURE', price: 2400, icon: '◊' },
    { id: 'statue', name: 'QUANTUM LIZA STATUE', price: 1800, icon: '◆' }
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
          setLizcoin(prev => prev + 50);
          setCoins(prev => prev.filter((_, i) => i !== index));
        }
      });
      
      // Check level completion
      if (playerPosition >= 680) {
        setGameRunning(false);
        if (!completedLevels.includes(gameLevel)) {
          setLizcoin(prev => prev + 100);
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
        setLizcoin(prev => prev + 25);
        setCompletedCrosswords(prev => [...prev, wordId]);
      }
      return true;
    }
    return false;
  };

  const buyItem = (item: any) => {
    if (lizcoin >= item.price) {
      setLizcoin(prev => prev - item.price);
      alert(`Вы купили ${item.name}! 🎉`);
    } else {
      alert('Недостаточно лизкоинов! 💰');
    }
  };

  const renderAuthSection = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background text-foreground relative overflow-hidden cyber-grid flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-50"></div>
      
      <Card className="auth-card w-full max-w-md mx-4 relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl gradient-text pickyside-font mb-4">
            ◼ LIZUNSK OS ◼
          </CardTitle>
          <p className="text-muted-foreground">ACCESS TERMINAL</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              placeholder="USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-effect pickyside-font text-center"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="PASSWORD"
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
              ▶ LOGIN
            </Button>
            <Button 
              onClick={handleRegister}
              className="flex-1 hover-scale neon-glow pickyside-font"
            >
              ◉ REGISTER
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMainSection = () => ("
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background text-foreground relative overflow-hidden cyber-grid">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-50"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-7xl font-bold gradient-text animate-fade-in neon-glow pickyside-font">
              ◼ LIZUNSK ◼
            </h1>
            <p className="text-lg text-muted-foreground pickyside-font">
              GALACTIC CIVILIZATION 3030
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-6 py-3 hover-scale glass-effect neon-glow">
              <Icon name="Coins" size={24} className="mr-2 text-primary" />
              <span className="gradient-text font-bold pickyside-font">{lizcoin}</span> LZC
            </Badge>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">USER:</p>
              <p className="pickyside-font text-primary">{currentUser}</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="hover-scale neon-glow pickyside-font"
            >
              ◆ LOGOUT
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { id: 'history', title: 'HISTORY', icon: '◈', desc: 'GALACTIC CIVILIZATION ORIGINS' },
            { id: 'shop', title: 'SHOP', icon: '◇', desc: 'COSMIC ITEMS FOR LZC' },
            { id: 'attractions', title: 'PLACES', icon: '◆', desc: 'INTERPLANETARY MONUMENTS' },
            { id: 'quests', title: 'QUESTS', icon: '◊', desc: 'EARN IN CYBERSPACE' }
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
              <CardTitle className="gradient-text pickyside-font">◈ REGIONS & CITIES</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveSection('cities')} 
                className="w-full hover-scale neon-glow pickyside-font"
                variant="outline"
              >
                ▶ EXPLORE TERRITORIES
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-effect neon-glow">
            <CardHeader>
              <CardTitle className="gradient-text pickyside-font">◇ LIZUN-MARIO</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setActiveSection('game')} 
                className="w-full hover-scale neon-glow pickyside-font"
                variant="outline"
              >
                ▶ ENTER CYBERSPACE
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
            <CardTitle className="text-3xl gradient-text pickyside-font">◈ LIZUNSK TERRITORIES</CardTitle>
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
                          <div className="text-3xl mb-2 text-primary">◼</div>
                          <p className="text-sm text-muted-foreground pickyside-font">
                            CYBER METROPOLIS
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
            <CardTitle className="text-3xl gradient-text pickyside-font">◇ LIZUN-MARIO: SPACE QUEST</CardTitle>
            <p className="text-muted-foreground pickyside-font">
              USE ← → ARROWS TO MOVE. COLLECT COINS AND REACH THE FINISH!
            </p>
          </CardHeader>
          <CardContent>
            {!gameRunning ? (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-lg mb-4 pickyside-font">SELECT LEVEL:</p>
                  <div className="flex gap-4 justify-center">
                    {[1, 2, 3].map(level => (
                      <Button
                        key={level}
                        onClick={() => startGame(level)}
                        className={`hover-scale neon-glow pickyside-font ${completedLevels.includes(level) ? 'bg-green-600' : ''}`}
                        variant="outline"
                      >
                        {completedLevels.includes(level) ? '◆' : '◇'} LEVEL {level}
                        {completedLevels.includes(level) && <span className="ml-2 text-xs">(+100 LZC)</span>}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Badge className="text-lg px-4 py-2 neon-glow pickyside-font">
                    LEVEL {gameLevel} | COINS: {3 - coins.length}/3
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
                    ◼ STOP GAME
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
            <CardTitle className="text-3xl gradient-text">🌌 История страны Лизунск</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              В далеком 3030 году, когда человечество освоило гипер-варп технологии, была основана 
              галактическая страна Лизунск - первая межпланетная цивилизация, посвященная сладостям.
            </p>
            <p>
              Страна получила свое название в честь легендарного киберлизуна - искусственного существа, 
              которое согласно космическим хроникам, охраняло квантовые рецепты антигравитационного мороженого.
            </p>
            <p>
              Сегодня Лизунск является центром галактической торговли сладостями, где каждый житель - 
              мастер создания уникальных вкусов с использованием молекулярных технологий будущего.
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
            <CardTitle className="text-3xl gradient-text">🛸 Космический магазин</CardTitle>
            <p className="text-muted-foreground">
              Ваш баланс: <span className="text-primary font-bold gradient-text">{lizcoin} лизкоинов</span>
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
                      disabled={lizcoin < item.price}
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
            <CardTitle className="text-3xl gradient-text">🏛️ Космические достопримечательности</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Квантовая статуя Лизы Свободы', emoji: '🗽', desc: 'Голографический символ галактики с антигравитационным рожком' },
                { name: 'Музей Молекулярного Мороженого', emoji: '🍦', desc: 'Самая большая коллекция межпланетных рецептов' },
                { name: 'Парк Космических Грез', emoji: '🌌', desc: 'Невесомый парк с фонтанами из жидкого азота' },
                { name: 'Мост Плазменных Лизунов', emoji: '🌉', desc: 'Энергетический мост между орбитальными станциями' }
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
            <CardTitle className="text-3xl gradient-text">⚡ Квантовые кроссворды</CardTitle>
            <p className="text-muted-foreground">
              Решайте киберзагадки и получайте по 25 лизкоинов за каждый правильный ответ!
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