import React, { useState, createContext, useContext, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5001/api';

// Context'ler
const AuthContext = createContext(null);
const DataContext = createContext(null);

// Hook'lar
const useAuth = () => useContext(AuthContext);
const useData = () => useContext(DataContext);

// API İstek Yardımcısı
const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const config = {
    method,
    headers,
  };
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    if (response.status === 204) return null; // No Content
    return response.json();
  } catch (error) {
    console.error(`API isteği başarısız oldu: ${method} ${endpoint}`, error);
    throw error;
  }
};

// --- Style Objects ---
const styles = { /* Ensure this is your complete styles object */ };
styles.appWrapper = { minHeight: '100vh', backgroundColor: '#f7fafc', fontFamily: 'sans-serif' };
styles.mainContent = { maxWidth: '1280px', margin: '0 auto', padding: '1rem' };
styles.loadingMessage = { textAlign: 'center', padding: '2.5rem' };
styles.errorMessage = { color: 'red', textAlign: 'center', padding: '1rem' };
styles.navbar = { backgroundColor: '#4299e1', color: 'white', padding: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'};
styles.navbarContainer = { maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
styles.navbarBrand = { fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' };
styles.navLink = { marginRight: '1rem', cursor: 'pointer', color: 'white', background: 'none', border: 'none', padding: 0, fontSize: '1em' };
styles.button = { padding: '0.5rem 1rem', fontWeight: 'bold', borderRadius: '0.25rem', border: 'none', cursor: 'pointer', color: 'white' };
styles.footer = { backgroundColor: '#2d3748', color: 'white', textAlign: 'center', padding: '1rem', marginTop: '2rem' };
styles.formContainer = { maxWidth: '500px', margin: '2.5rem auto 0 auto', backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' };
styles.formTitle = { fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', color: '#4a5568' };
styles.formGroup = { marginBottom: '1rem' };
styles.formLabel = { display: 'block', color: '#4a5568', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' };
styles.input = { border: '1px solid #ccc', borderRadius: '0.25rem', padding: '0.5rem 0.75rem', width: '100%', boxSizing: 'border-box' };
styles.formButtonPrimary = (isLoading) => ({ ...styles.button, backgroundColor: '#3182ce', opacity: isLoading ? 0.5 : 1 });
styles.formButtonSecondary = { display: 'inline-block', fontWeight: 'bold', fontSize: '0.875rem', color: '#3182ce', cursor: 'pointer', background: 'none', border: 'none' };
styles.sectionTitle = { fontSize: '1.875rem', fontWeight: '600', marginBottom: '1.5rem', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' };
styles.card = { backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05)', marginBottom: '1rem' };
styles.cardTitle = { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#3182ce' };
styles.cardText = { color: '#4a5568', marginBottom: '0.25rem' };
styles.adminDashboard = { backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)', marginTop: '1.5rem' };
styles.tabsContainer = { marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' };
styles.tabNav = { display: 'flex' };
styles.tabButton = (isActive) => ({ whiteSpace: 'nowrap', padding: '1rem 0.25rem', borderBottom: isActive ? '2px solid #3182ce' : '2px solid transparent', color: isActive ? '#2b6cb0' : '#718096', fontWeight: '500', fontSize: '0.875rem', marginRight: '2rem', cursor: 'pointer', background: 'none', borderTop:'none', borderLeft:'none', borderRight:'none'});
styles.listItem = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f7fafc', padding: '0.75rem', borderRadius: '0.375rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,.05)', marginBottom: '0.75rem' };
styles.adminListItem = { ...styles.listItem, flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' };
styles.adminListItemActions = { display: 'flex', gap: '0.5rem', marginTop: '0.5rem' };
styles.adminActionButton = (color = '#3182ce') => ({ ...styles.button, backgroundColor: color, fontSize: '0.875rem', padding: '0.25rem 0.75rem' });
styles.cartItem = { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f7fafc', padding: '1rem', borderRadius: '0.375rem', boxShadow: '0 1px 2px 0 rgba(0,0,0,.05)', marginBottom: '1rem' };
styles.cartItemDetails = { marginBottom: '0.5rem', textAlign: 'center' };
styles.cartItemActions = { display: 'flex', alignItems: 'center' };
styles.quantityInput = { width: '4rem', padding: '0.25rem', border: '1px solid #ccc', borderRadius: '0.25rem', textAlign: 'center', marginRight: '0.5rem' };
styles.totalAmountText = { fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'right', color: '#2d3748', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' };
styles.textCenter = { textAlign: 'center' };
styles.quotaText = { fontSize: '0.875rem', color: '#e53e3e', fontWeight: '500', marginTop: '0.25rem' };


// Ana Uygulama Bileşeni
function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [cart, setCart] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');

  const [authLoading, setAuthLoading] = useState(false);
  const [initialDataLoading, setInitialDataLoading] = useState(false);
  const [pageActionLoading, setPageActionLoading] = useState(false); 

  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
  }, [token]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setToken(null);
    setEvents([]);
    setAnnouncements([]);
    setCart([]);
    setPendingUsers([]);
    setCurrentPage('home');
    setError(null);
    localStorage.removeItem('currentUser');
  }, []);

  useEffect(() => {
    const storedUserJSON = localStorage.getItem('currentUser');
    if (token && !currentUser && storedUserJSON) {
      try {
        const parsedUser = JSON.parse(storedUserJSON);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error("Error parsing stored user:", e);
        logout(); 
      }
    } else if (token && !currentUser && !storedUserJSON) {
        console.warn("Token present but no user in localStorage. Will attempt data fetch.");
    }
  }, [token, currentUser, logout]);


  const fetchInitialData = useCallback(async () => {
    if (token && currentUser) {
      console.log("fetchInitialData START - User:", currentUser.email, "ForceChange:", currentUser.forcePasswordChange);
      setInitialDataLoading(true);
      setError(null);
      try {
        // Force password change navigation is handled by a separate useEffect

        const [eventsData, announcementsData, cartData] = await Promise.all([
          apiRequest('/events', 'GET', null, token),
          apiRequest('/announcements', 'GET', null, token),
          apiRequest('/cart', 'GET', null, token)
        ]);
        setEvents(eventsData || []);
        setAnnouncements(announcementsData || []);
        setCart(cartData || []);

        if (currentUser.role === 'admin') {
          const pending = await apiRequest('/admin/users/pending', 'GET', null, token);
          setPendingUsers(pending || []);
        }
        console.log("fetchInitialData SUCCESS");
      } catch (err) {
        setError(err.message);
        console.error("fetchInitialData CATCH:", err);
        if (String(err.message).includes("401") || String(err.message).includes("403") || String(err.message).toLowerCase().includes("token") || String(err.message).toLowerCase().includes("unauthorized")) {
          logout();
        }
      } finally {
        console.log("fetchInitialData FINALLY - Setting initialDataLoading to false");
        setInitialDataLoading(false);
      }
    } else {
         console.log("fetchInitialData SKIPPED - No token or currentUser");
         setInitialDataLoading(false); 
    }
  }, [token, currentUser, logout]);

  useEffect(() => {
    if (token && currentUser) { 
        fetchInitialData();
    } else if (!token) {
        setInitialDataLoading(false);
        setEvents([]);
        setAnnouncements([]);
        setCart([]);
        setPendingUsers([]);
    }
  }, [token, currentUser, fetchInitialData]); 

  useEffect(() => {
    if (!initialDataLoading && token && currentUser) {
        if (currentUser.forcePasswordChange) {
            if (currentPage !== 'changePassword') {
                setCurrentPage('changePassword');
            }
        } else {
            if (currentPage === 'login' || currentPage === 'register' || currentPage === 'changePassword') {
                const targetPage = currentUser.role === 'admin' ? 'admin' : 'home';
                setCurrentPage(targetPage);
            }
        }
    } else if (!token && !currentUser) {
        if (!['home', 'login', 'register'].includes(currentPage)) {
            setCurrentPage('home');
        }
    }
  }, [currentUser, initialDataLoading, token, currentPage, setCurrentPage]); // Removed logout from deps as it's stable via useCallback


  const authContextValue = {
    currentUser,
    token,
    authLoading, 
    error, 
    setError,
    login: async (email, password) => {
      setAuthLoading(true); setError(null);
      try {
        const data = await apiRequest('/auth/login', 'POST', { email, password });
        setCurrentUser(data.user); 
        setToken(data.token);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        return true;
      } catch (err) { setError(err.message); return false; } finally { setAuthLoading(false); }
    },
    register: async (email, password, role) => {
      setAuthLoading(true); setError(null);
      try {
        await apiRequest('/auth/register', 'POST', { email, password, role });
        alert('Kayıt başarılı! Onay için lütfen bekleyin veya yöneticiyseniz/onayınız varsa giriş yapabilirsiniz.');
        setCurrentPage('login'); 
        return true;
      } catch (err) { setError(err.message); alert(`Kayıt başarısız: ${err.message}`); return false; } finally { setAuthLoading(false); }
    },
    logout: logout,
    changePassword: async (newPassword) => {
      if (!token || !currentUser) return false;
      setAuthLoading(true); setError(null);
      try {
        await apiRequest('/auth/change-password', 'POST', { newPassword }, token);
        const updatedUser = { ...currentUser, forcePasswordChange: false };
        setCurrentUser(updatedUser); 
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        alert('Şifreniz başarıyla değiştirildi.');
        return true;
      } catch (err) { setError(err.message); alert(`Şifre değiştirme başarısız: ${err.message}`); return false; } finally { setAuthLoading(false); }
    },
  };

  const dataContextValue = {
    events, announcements, cart, pendingUsers,
    initialDataLoading, pageActionLoading, error,
    setError,
    fetchEvents: async () => {
        if (!token || !currentUser) return false;
        setPageActionLoading(true); setError(null);
        try {
            const data = await apiRequest('/events', 'GET', null, token);
            setEvents(data || []);
            return true;
        } catch(err) { 
            setError(err.message); 
            if (String(err.message).includes("401") || String(err.message).includes("403")) logout();
            return false;
        } finally { setPageActionLoading(false); }
    },
    fetchAnnouncements: async () => {
        if (!token || !currentUser) return false;
        setPageActionLoading(true); setError(null);
        try {
            const data = await apiRequest('/announcements', 'GET', null, token);
            setAnnouncements(data || []);
            return true;
        } catch(err) { 
            setError(err.message); 
            if (String(err.message).includes("401") || String(err.message).includes("403")) logout();
            return false;
        } finally { setPageActionLoading(false); }
    },
    fetchCart: async () => {
        if (!token || !currentUser) return false;
        setPageActionLoading(true); setError(null);
        try {
            const data = await apiRequest('/cart', 'GET', null, token);
            setCart(data || []);
            return true;
        } catch(err) { 
            setError(err.message); 
            if (String(err.message).includes("401") || String(err.message).includes("403")) logout();
            return false;
        } finally { setPageActionLoading(false); }
    },
    fetchPendingUsers: async () => {
        if (!token || !currentUser || currentUser.role !== 'admin') return false;
        setPageActionLoading(true); setError(null);
        try {
            const data = await apiRequest('/admin/users/pending', 'GET', null, token);
            setPendingUsers(data || []);
            return true;
        } catch(err) { 
            setError(err.message); 
            if (String(err.message).includes("401") || String(err.message).includes("403")) logout();
            return false;
        } finally { setPageActionLoading(false); }
    },
    approveUser: async (userId) => {
      if (!token || !currentUser || currentUser.role !== 'admin') {
        alert('Yetkiniz yok veya oturumunuz sonlanmış.');
        return false;
      }
      setPageActionLoading(true);
      setError(null);
      try {
        await apiRequest(`/admin/users/${userId}/approve`, 'PUT', null, token);
        setPendingUsers(prevPendingUsers => prevPendingUsers.filter(user => user.id !== userId));
        alert('Kullanıcı başarıyla onaylandı.');
        return true;
      } catch (err) {
        setError(err.message);
        alert(`Kullanıcı onaylama başarısız: ${err.message}`);
        if (String(err.message).includes("401") || String(err.message).includes("403")) {
          logout();
        }
        return false;
      } finally {
        setPageActionLoading(false);
      }
    },
    addEvent: async (eventData) => {
      if (!token || currentUser?.role !== 'admin') return false;
      setPageActionLoading(true); setError(null);
      try {
        const newEvent = await apiRequest('/admin/events', 'POST', eventData, token);
        setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.date) - new Date(b.date)));
        alert('Etkinlik eklendi.'); return true;
      } catch (err) { setError(err.message); alert(`Etkinlik ekleme başarısız: ${err.message}`); if (String(err.message).includes("401")) logout(); return false;} finally { setPageActionLoading(false); }
    },
    updateEvent: async (eventId, eventData) => {
        if (!token || currentUser?.role !== 'admin') return false;
        setPageActionLoading(true); setError(null);
        try {
            const updatedEvent = await apiRequest(`/admin/events/${eventId}`, 'PUT', eventData, token);
            setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e).sort((a, b) => new Date(a.date) - new Date(b.date)));
            await dataContextValue.fetchCart(); 
            alert('Etkinlik güncellendi.'); return true;
        } catch (err) { setError(err.message); alert(`Etkinlik güncelleme başarısız: ${err.message}`); if (String(err.message).includes("401")) logout(); return false; } finally { setPageActionLoading(false); }
    },
    deleteEvent: async (eventId) => {
        if (!token || currentUser?.role !== 'admin') return false;
        setPageActionLoading(true); setError(null);
        try {
            await apiRequest(`/admin/events/${eventId}`, 'DELETE', null, token);
            setEvents(prev => prev.filter(e => e.id !== eventId));
            await dataContextValue.fetchCart(); 
            alert('Etkinlik silindi.'); return true;
        } catch (err) { setError(err.message); alert(`Etkinlik silme başarısız: ${err.message}`); if (String(err.message).includes("401")) logout(); return false;} finally { setPageActionLoading(false); }
    },
    addAnnouncement: async (announcementData) => {
      if (!token || currentUser?.role !== 'admin') return false;
      setPageActionLoading(true); setError(null);
      try {
        const newAnnouncement = await apiRequest('/admin/announcements', 'POST', announcementData, token);
        setAnnouncements(prev => [newAnnouncement, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        alert('Duyuru eklendi.'); return true;
      } catch (err) { setError(err.message); alert(`Duyuru ekleme başarısız: ${err.message}`); if (String(err.message).includes("401")) logout(); return false;} finally { setPageActionLoading(false); }
    },
    updateAnnouncement: async (announcementId, announcementData) => {
        if (!token || currentUser?.role !== 'admin') return false;
        setPageActionLoading(true); setError(null);
        try {
            const updatedAnnouncement = await apiRequest(`/admin/announcements/${announcementId}`, 'PUT', announcementData, token);
            setAnnouncements(prev => prev.map(a => a.id === announcementId ? updatedAnnouncement : a).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
            alert('Duyuru güncellendi.'); return true;
        } catch (err) { setError(err.message); alert(`Duyuru güncelleme başarısız: ${err.message}`); if (String(err.message).includes("401")) logout(); return false;} finally { setPageActionLoading(false); }
    },
    deleteAnnouncement: async (announcementId) => {
        if (!token || currentUser?.role !== 'admin') return false;
        setPageActionLoading(true); setError(null);
        try {
            await apiRequest(`/admin/announcements/${announcementId}`, 'DELETE', null, token);
            setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
            alert('Duyuru silindi.'); return true;
        } catch (err) { setError(err.message); alert(`Duyuru silme başarısız: ${err.message}`); if (String(err.message).includes("401")) logout(); return false;} finally { setPageActionLoading(false); }
    },
    addToCart: async (event, quantity = 1) => {
      if (!token || !currentUser) return false;
      setPageActionLoading(true); setError(null);
      try {
        const updatedCart = await apiRequest('/cart/add', 'POST', { eventId: event.id, quantity }, token);
        setCart(updatedCart);
        const eventsData = await apiRequest('/events', 'GET', null, token);
        setEvents(eventsData || []);
        alert(`${event.title} (${quantity} adet) sepete eklendi.`); return true;
      } catch (err) { setError(err.message); alert(`Sepete ekleme başarısız: ${err.message}`); if (String(err.message).includes("401")) logout(); return false;} finally { setPageActionLoading(false); }
    },
    removeFromCart: async (eventId) => {
      if (!token || !currentUser) return false;
      setPageActionLoading(true); setError(null);
      try {
        const updatedCart = await apiRequest(`/cart/item/${eventId}`, 'DELETE', null, token);
        setCart(updatedCart);
        const eventsData = await apiRequest('/events', 'GET', null, token);
        setEvents(eventsData || []);
        return true;
      } catch (err) { setError(err.message); alert(`Ürün kaldırma başarısız: ${err.message}`); if (String(err.message).includes("401")) logout(); return false;} finally { setPageActionLoading(false); }
    },
    updateCartQuantity: async (eventId, quantity) => {
      if (!token || !currentUser) return false;
      setPageActionLoading(true); setError(null);
      try {
        const updatedCart = await apiRequest(`/cart/item/${eventId}`, 'PUT', { quantity }, token);
        setCart(updatedCart);
        const eventsData = await apiRequest('/events', 'GET', null, token);
        setEvents(eventsData || []);
        return true;
      } catch (err) { setError(err.message); alert(`Miktar güncelleme başarısız: ${err.message}`); if (String(err.message).includes("401")) logout(); return false;} finally { setPageActionLoading(false); }
    }
  };

  const renderPage = () => {
    if (!token && !currentUser && (currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'home')) {
        return <LoginPage setCurrentPage={setCurrentPage} />;
    }

    if (token && !currentUser && !authLoading) { 
        if (!['login', 'register'].includes(currentPage) && initialDataLoading) {
            return <div style={styles.loadingMessage}>Veriler yükleniyor... (Kullanıcı bekleniyor)</div>;
        }
    }
    
    if (initialDataLoading && currentUser && !['login', 'register', 'changePassword'].includes(currentPage)) {
      return <div style={styles.loadingMessage}>Veriler yükleniyor...</div>;
    }

    if (error && !authLoading && !pageActionLoading && !initialDataLoading && !['login', 'register', 'changePassword'].includes(currentPage)) {
        // Displaying global error. HomePage and Admin pages also have specific error displays.
        // return <div style={styles.errorMessage}>Bir hata oluştu: {error} <button onClick={() => setError(null)}>Kapat</button></div>;
    }

    if (currentPage === 'login') return <LoginPage setCurrentPage={setCurrentPage} />;
    if (currentPage === 'register') return <RegisterPage setCurrentPage={setCurrentPage} />;
    
    if (!currentUser && (currentPage === 'changePassword' || currentPage === 'admin' || currentPage === 'cart')) {
        return <LoginPage setCurrentPage={setCurrentPage} />;
    }

    if (currentPage === 'changePassword' && currentUser) return <ChangePasswordPage setCurrentPage={setCurrentPage} />;
    
    if (currentUser && currentUser.forcePasswordChange && currentPage !== 'changePassword') {
        return <ChangePasswordPage setCurrentPage={setCurrentPage} />;
    }

    if (currentPage === 'admin' && currentUser?.role === 'admin') return <AdminDashboardPage />;
    if (currentPage === 'cart' && currentUser) return <CartPage setCurrentPage={setCurrentPage} />;
    
    return <HomePage setCurrentPage={setCurrentPage} />;
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <DataContext.Provider value={dataContextValue}>
        <div style={styles.appWrapper}>
          <Navbar setCurrentPage={setCurrentPage} />
          <main style={styles.mainContent}>
            {renderPage()}
          </main>
          <Footer />
        </div>
      </DataContext.Provider>
    </AuthContext.Provider>
  );
}

// --- Bileşenler (Navbar, Footer, HomePage, LoginPage, RegisterPage, ChangePasswordPage, AdminDashboardPage, UserApprovalSection, EventManagementSection, AnnouncementManagementSection, CartPage) ---
// Ensure all component definitions from your previous correct version are here.
// For brevity, I'm not re-pasting them if they were correct and unchanged by this specific fix.
// The key was to fill in the DataContext fetch functions and ensure approveUser is correct.

function Navbar({ setCurrentPage }) {
  const { currentUser, logout, token } = useAuth(); 

  const handleNav = (page) => {
    if (currentUser && currentUser.forcePasswordChange && page !== 'changePassword' && page !== 'logout') { // Allow logout even if forcePasswordChange
        alert("Lütfen önce şifrenizi değiştirin.");
        setCurrentPage('changePassword');
    } else {
        setCurrentPage(page);
    }
  }

  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarContainer}>
        <h1 style={styles.navbarBrand} onClick={() => handleNav('home')}>Etkinlik Platformu</h1>
        <div>
          <button onClick={() => handleNav('home')} style={styles.navLink}>Ana Sayfa</button>
          {token && currentUser ? ( 
            <>
              {currentUser.role === 'admin' && !currentUser.forcePasswordChange && (
                <button onClick={() => handleNav('admin')} style={styles.navLink}>Yönetici Paneli</button>
              )}
              {!currentUser.forcePasswordChange && (
                <button onClick={() => handleNav('cart')} style={styles.navLink}>Sepet</button>
              )}
              <span style={{ marginRight: '1rem' }}>Hoşgeldin, {currentUser.email} ({currentUser.role})</span>
              {currentUser.forcePasswordChange && <button onClick={() => handleNav('changePassword')} style={{...styles.button, backgroundColor: '#dd6b20', marginRight: '0.5rem' }}>Şifre Değiştir!</button>}
              <button onClick={logout} style={{...styles.button, backgroundColor: '#e53e3e' }}>Çıkış Yap</button>
            </>
          ) : (
            <>
              <button onClick={() => setCurrentPage('login')} style={styles.navLink}>Giriş Yap</button>
              <button onClick={() => setCurrentPage('register')} style={{...styles.button, backgroundColor: '#48bb78' }}>Kayıt Ol</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function Footer() { 
  return ( <footer style={styles.footer}> <p>&copy; {new Date().getFullYear()} Etkinlik Platformu. Tüm hakları saklıdır.</p> </footer> );
}

function HomePage({ setCurrentPage }) {
  const { events, announcements, addToCart, initialDataLoading, pageActionLoading } = useData();
  const { currentUser, token, error, authLoading, setError } = useAuth(); // Added setError for local error clearing

  // Clear global error if HomePage is mounted and there's an error (could be from previous page)
  useEffect(() => {
    if(error) setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (!token && !currentUser && !authLoading) return (
    <p style={{...styles.loadingMessage, fontSize: '1.125rem'}}>
      Etkinlikleri ve duyuruları görmek için lütfen {}
      <button onClick={() => setCurrentPage('login')} style={{color: '#3182ce', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize:'inherit'}}>giriş yapın</button> {}
      veya {}
      <button onClick={() => setCurrentPage('register')} style={{color: '#48bb78', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize:'inherit'}}>kayıt olun</button>.
    </p>
  );
  
  if (initialDataLoading && token && currentUser) return <p style={styles.loadingMessage}>Etkinlikler ve duyurular yükleniyor...</p>;
  if (token && !currentUser && !initialDataLoading && !authLoading) return <p style={styles.loadingMessage}>Kullanıcı bilgileri doğrulanıyor...</p>;
  
  // Display error from AuthContext if it's relevant here (e.g., a general API error during initial load)
  // Individual actions will show alerts, but this catches broader errors.
  if (error && (events.length === 0 && announcements.length === 0 && !initialDataLoading && !pageActionLoading) ) {
      return <p style={styles.errorMessage}>Bir hata oluştu: {error} <button onClick={() => setError(null)}>Kapat</button></p>;
  }


  return (
    <div>
      {/* Removed global error display from here as specific conditions above handle it better or alerts are used */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={styles.sectionTitle}>Duyurular</h2>
        {announcements.length === 0 && !initialDataLoading ? <p>Şu anda gösterilecek duyuru bulunmamaktadır.</p> :
          (initialDataLoading && announcements.length === 0 ? <p>Duyurular yükleniyor...</p> :
            <div> {announcements.map(ann => ( <div key={ann.id} style={styles.card}> <h3 style={styles.cardTitle}>{ann.title}</h3> <p style={styles.cardText}>{ann.content}</p> <p style={{fontSize: '0.75rem', color: '#a0aec0'}}>Yayınlanma: {new Date(ann.createdAt).toLocaleDateString('tr-TR')}</p> </div> ))} </div>
          )
        }
      </section>

      <section>
        <h2 style={styles.sectionTitle}>Etkinlikler</h2>
        {events.length === 0 && !initialDataLoading ? <p>Şu anda gösterilecek etkinlik bulunmamaktadır.</p> :
          (initialDataLoading && events.length === 0 ? <p>Etkinlikler yükleniyor...</p> :
            <div> {events.map(event => (
                <div key={event.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{event.title}</h3>
                  <p style={{...styles.cardText, color: '#718096' }}><span style={{ fontWeight: '600' }}>Açıklama:</span> {event.description || "Açıklama yok"}</p>
                  <p style={{...styles.cardText, color: '#718096' }}><span style={{ fontWeight: '600' }}>Tarih:</span> {new Date(event.date).toLocaleDateString('tr-TR')}</p>
                  <p style={{...styles.cardText, color: '#718096' }}><span style={{ fontWeight: '600' }}>Yer:</span> {event.location}</p>
                  <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#38a169', marginBottom: '0.25rem' }}>{event.price} TL</p>
                  <p style={{...styles.cardText, color: '#4A5568' }}><span style={{ fontWeight: '600' }}>Kalan Kontenjan:</span> {event.quota}</p>
                  {currentUser && currentUser.role === 'user' && !currentUser.forcePasswordChange && (
                    <button 
                      onClick={() => {
                          if (event.quota > 0) addToCart(event);
                          else alert("Bu etkinlik için kontenjan dolmuştur.");
                      }} 
                      disabled={pageActionLoading || event.quota <= 0}
                      style={{ ...styles.button, width: '100%', backgroundColor: event.quota > 0 ? '#48bb78' : '#A0AEC0', opacity: pageActionLoading ? 0.5 : 1, marginTop: '0.5rem' }}>
                      {pageActionLoading ? "İşleniyor..." : (event.quota > 0 ? "Sepete Ekle" : "Kontenjan Dolu")}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        }
      </section>
    </div>
  );
}

function LoginPage({ setCurrentPage }) { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, authLoading, error, setError } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        await login(email, password);
    };

    return (
        <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>Giriş Yap</h2>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}> <label style={styles.formLabel} htmlFor="email-login">E-posta</label> <input type="email" id="email-login" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required /> </div>
            <div style={{ marginBottom: '1.5rem' }}> <label style={styles.formLabel} htmlFor="password-login">Şifre</label> <input type="password" id="password-login" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required /> </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button type="submit" disabled={authLoading} style={styles.formButtonPrimary(authLoading)}> {authLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'} </button>
            <button type="button" onClick={() => { setError(null); setCurrentPage('register');}} style={styles.formButtonSecondary}> Hesabın yok mu? Kayıt Ol </button>
            </div>
        </form>
        </div>
    );
}
function RegisterPage({ setCurrentPage }) { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user');
    const { register, authLoading, error, setError } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) { alert('Şifreler eşleşmiyor.'); return; }
        await register(email, password, role);
    };
    return ( <div style={styles.formContainer}> <h2 style={styles.formTitle}>Kayıt Ol</h2> {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>} <form onSubmit={handleSubmit}> <div style={styles.formGroup}> <label style={styles.formLabel} htmlFor="email-register">E-posta</label> <input type="email" id="email-register" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required /> </div> <div style={styles.formGroup}> <label style={styles.formLabel} htmlFor="password-register">Şifre</label> <input type="password" id="password-register" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required /> </div> <div style={{ marginBottom: '1.5rem' }}> <label style={styles.formLabel} htmlFor="confirmPassword-register">Şifre Tekrar</label> <input type="password" id="confirmPassword-register" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={styles.input} required /> </div> <div style={{ marginBottom: '1.5rem' }}> <label style={styles.formLabel} htmlFor="role-register">Rol</label> <select id="role-register" value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}> <option value="user">Kullanıcı</option> <option value="admin">Yönetici</option> </select> <p style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '0.25rem' }}>Not: 'Kullanıcı' rolü yönetici onayı ve ilk girişte şifre değişimi gerektirir. 'Yönetici' rolü otomatik onaylanır.</p> </div> <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}> <button type="submit" disabled={authLoading} style={{...styles.formButtonPrimary(authLoading), backgroundColor: '#48bb78'}}> {authLoading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'} </button> <button type="button" onClick={() => {setError(null); setCurrentPage('login');}} style={styles.formButtonSecondary}> Zaten hesabın var mı? Giriş Yap </button> </div> </form> </div> );
}
function ChangePasswordPage({ setCurrentPage }) { 
    const { currentUser, changePassword, authLoading, error, setError } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!currentUser) { alert('Önce giriş yapmalısınız.'); setCurrentPage('login'); return; }
        if (newPassword !== confirmNewPassword) { alert('Yeni şifreler eşleşmiyor.'); return; }
        await changePassword(newPassword);
    };
    return ( <div style={styles.formContainer}> <h2 style={styles.formTitle}>Şifre Değiştir</h2> {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>} <p style={{ textAlign: 'center', color: '#718096', marginBottom: '1rem' }}>{currentUser?.forcePasswordChange ? "Devam etmek için lütfen yeni bir şifre belirleyin." : "Yeni şifrenizi girin."}</p> <form onSubmit={handleSubmit}> <div style={styles.formGroup}> <label style={styles.formLabel} htmlFor="newPassword-change">Yeni Şifre</label> <input type="password" id="newPassword-change" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={styles.input} required /> </div> <div style={{ marginBottom: '1.5rem' }}> <label style={styles.formLabel} htmlFor="confirmNewPassword-change">Yeni Şifre Tekrar</label> <input type="password" id="confirmNewPassword-change" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} style={styles.input} required /> </div> <button type="submit" disabled={authLoading} style={{...styles.formButtonPrimary(authLoading), width: '100%'}}> {authLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'} </button> </form> </div> );
}

function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('users'); 
  const { initialDataLoading, error, setError } = useData(); 
  const { currentUser } = useAuth();

  useEffect(() => { // Clear global error when admin dashboard is mounted/focused
    if(error) setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);


  if (initialDataLoading && currentUser?.role === 'admin') {
      return <p style={styles.loadingMessage}>Yönetici paneli verileri yükleniyor...</p>;
  }
  if (!currentUser || currentUser.role !== 'admin') {
      return <p style={styles.errorMessage}>Bu sayfaya erişim yetkiniz yok.</p>; 
  }
  if (currentUser.forcePasswordChange) { 
      return <p style={styles.errorMessage}>Devam etmek için lütfen şifrenizi değiştirin.</p>;
  }
  // Display error from DataContext if relevant to the dashboard as a whole
  if (error && (activeTab === 'users' || activeTab === 'events' || activeTab === 'announcements') && !initialDataLoading) {
      return <p style={styles.errorMessage}>Bir hata oluştu: {error} <button onClick={() => setError(null)}>Kapat</button></p>;
  }


  const sectionHeaderStyle = { fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#4a5568' };

  return (
    <div style={styles.adminDashboard}>
      <h2 style={{...styles.sectionTitle, borderBottom: 'none', paddingBottom: 0 }}>Yönetici Paneli</h2>
      <div style={styles.tabsContainer}>
        <nav style={styles.tabNav} aria-label="Tabs">
          <button onClick={() => setActiveTab('users')} style={styles.tabButton(activeTab === 'users')}>Kullanıcı Onayları</button>
          <button onClick={() => setActiveTab('events')} style={styles.tabButton(activeTab === 'events')}>Etkinlik Yönetimi</button>
          <button onClick={() => setActiveTab('announcements')} style={styles.tabButton(activeTab === 'announcements')}>Duyuru Yönetimi</button>
        </nav>
      </div>
      {activeTab === 'users' && <UserApprovalSection headerStyle={sectionHeaderStyle} />}
      {activeTab === 'events' && <EventManagementSection headerStyle={sectionHeaderStyle} />}
      {activeTab === 'announcements' && <AnnouncementManagementSection headerStyle={sectionHeaderStyle} />}
    </div>
  );
}

function UserApprovalSection({ headerStyle }) { 
    const { pendingUsers, approveUser, pageActionLoading, initialDataLoading, error, setError } = useData();
    
    useEffect(() => { // Clear error when this specific section is active and an error exists
        if(error) setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (initialDataLoading && pendingUsers.length === 0) return <p>Onay bekleyen kullanıcılar yükleniyor...</p>;
    // Error specific to this section after loading
    if (error && !initialDataLoading) return <p style={styles.errorMessage}>Kullanıcılar yüklenirken hata: {error} <button onClick={() => setError(null)}>Kapat</button></p>;
    
    return (
        <div>
        <h3 style={headerStyle}>Onay Bekleyen Kullanıcılar</h3>
        {!initialDataLoading && pendingUsers.length === 0 ? (
            <p style={{ color: '#718096' }}>Onay bekleyen kullanıcı bulunmamaktadır.</p>
        ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
            {pendingUsers.map(user => (
                <li key={user.id} style={styles.listItem}>
                <div> <p style={{ fontWeight: '500', color: '#2d3748' }}>{user.email}</p> <p style={{ fontSize: '0.875rem', color: '#a0aec0' }}>Rol: {user.role} | Kayıt: {new Date(user.createdAt).toLocaleDateString()}</p> </div>
                <button onClick={() => approveUser(user.id)} disabled={pageActionLoading} style={{ ...styles.button, backgroundColor: '#48bb78', fontSize: '0.875rem', padding: '0.25rem 0.75rem', opacity: pageActionLoading ? 0.5 : 1, }}>
                    {pageActionLoading ? 'Onaylanıyor...' : 'Onayla'}
                </button>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}

function EventManagementSection({ headerStyle }) {
  const { events, addEvent, updateEvent, deleteEvent, pageActionLoading, initialDataLoading, error, setError } = useData();
  
  useEffect(() => { // Clear error when this specific section is active and an error exists
    if(error) setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [quota, setQuota] = useState('');

  const resetForm = () => {
    setTitle(''); setDescription(''); setDate(''); setLocation(''); setPrice(''); setQuota('');
    setIsEditing(false); setCurrentEvent(null);
  };

  const handleEdit = (event) => {
    setError(null); // Clear error when starting an edit
    setIsEditing(true);
    setCurrentEvent(event);
    setTitle(event.title);
    setDescription(event.description || '');
    setDate(event.date.split('T')[0]); 
    setLocation(event.location);
    setPrice(String(event.price));
    setQuota(String(event.initialQuota)); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear error before submitting
    const eventData = { title, description, date, location, price: parseFloat(price), quota: parseInt(quota) };
    let success = false;
    if (isEditing && currentEvent) {
      success = await updateEvent(currentEvent.id, eventData);
    } else {
      success = await addEvent(eventData);
    }
    if (success) resetForm();
  };

  const handleDelete = async (eventId) => {
    setError(null); // Clear error before deleting
    if (window.confirm("Bu etkinliği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
        await deleteEvent(eventId);
    }
  }
  
  const formStyle = { marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '0.375rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)'};
  const inputGroupStyle = { marginBottom: '1rem' };

  if (initialDataLoading && events.length === 0) return <p>Etkinlikler yükleniyor...</p>;
  if (error && !initialDataLoading) return <p style={styles.errorMessage}>Etkinlikler işlenirken hata: {error} <button onClick={() => setError(null)}>Kapat</button></p>;


  return (
    <div>
      <h3 style={headerStyle}>{isEditing ? "Etkinliği Düzenle" : "Yeni Etkinlik Ekle"}</h3>
      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Form Inputs */}
        <div style={inputGroupStyle}><label style={styles.formLabel}>Başlık</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} style={styles.input} required /></div>
        <div style={inputGroupStyle}><label style={styles.formLabel}>Açıklama</label><textarea value={description} onChange={e => setDescription(e.target.value)} style={{...styles.input, minHeight: '80px'}} /></div>
        <div style={inputGroupStyle}><label style={styles.formLabel}>Tarih</label><input type="date" value={date} onChange={e => setDate(e.target.value)} style={styles.input} required /></div>
        <div style={inputGroupStyle}><label style={styles.formLabel}>Yer</label><input type="text" value={location} onChange={e => setLocation(e.target.value)} style={styles.input} required /></div>
        <div style={inputGroupStyle}><label style={styles.formLabel}>Fiyat (TL)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} style={styles.input} step="0.01" min="0" required /></div>
        <div style={inputGroupStyle}><label style={styles.formLabel}>Kontenjan</label><input type="number" value={quota} onChange={e => setQuota(e.target.value)} style={styles.input} step="1" min="0" required /></div>
        <div style={{display: 'flex', gap: '1rem'}}>
            <button type="submit" disabled={pageActionLoading} style={{...styles.formButtonPrimary(pageActionLoading) }}> {pageActionLoading ? 'İşleniyor...' : (isEditing ? 'Güncelle' : 'Ekle')} </button>
            {isEditing && <button type="button" onClick={resetForm} style={{...styles.button, backgroundColor: '#718096'}}>İptal</button>}
        </div>
      </form>

      <h3 style={headerStyle}>Mevcut Etkinlikler</h3>
      {!initialDataLoading && events.length === 0 ? <p style={{ color: '#718096' }}>Etkinlik bulunmamaktadır.</p> :
        (initialDataLoading && events.length === 0 ? <p>Etkinlikler yükleniyor...</p> :
            <ul style={{ listStyle: 'none', padding: 0 }}> {events.map(event => ( 
                <li key={event.id} style={styles.adminListItem}> 
                    <div>
                        <p style={{fontWeight: 'bold'}}>{event.title} </p>
                        <p style={{fontSize:'0.9em'}}>Tarih: {new Date(event.date).toLocaleDateString('tr-TR')} - Fiyat: {event.price} TL</p>
                        <p style={{fontSize:'0.9em'}}>Kontenjan: {event.quota} / {event.initialQuota}</p>
                    </div>
                    <div style={styles.adminListItemActions}>
                        <button onClick={() => handleEdit(event)} style={styles.adminActionButton('#ECC94B')} disabled={pageActionLoading}>Düzenle</button>
                        <button onClick={() => handleDelete(event.id)} style={styles.adminActionButton('#F56565')} disabled={pageActionLoading}>Sil</button>
                    </div>
                </li> ))} 
            </ul>
        )
      }
    </div>
  );
}

function AnnouncementManagementSection({ headerStyle }) {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement, pageActionLoading, initialDataLoading, error, setError } = useData();
  
  useEffect(() => { 
    if(error) setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const resetForm = () => {
    setTitle(''); setContent(''); 
    setIsEditing(false); setCurrentAnnouncement(null);
  };

  const handleEdit = (ann) => {
    setError(null);
    setIsEditing(true);
    setCurrentAnnouncement(ann);
    setTitle(ann.title);
    setContent(ann.content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const annData = { title, content };
    let success = false;
    if (isEditing && currentAnnouncement) {
      success = await updateAnnouncement(currentAnnouncement.id, annData);
    } else {
      success = await addAnnouncement(annData);
    }
    if (success) resetForm();
  };

   const handleDelete = async (annId) => {
    setError(null);
    if (window.confirm("Bu duyuruyu silmek istediğinizden emin misiniz?")) {
        await deleteAnnouncement(annId);
    }
  }

  const formStyle = { marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f7fafc', borderRadius: '0.375rem', boxShadow: '0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06)'};
  const inputGroupStyle = { marginBottom: '1rem' };
  
  if (initialDataLoading && announcements.length === 0) return <p>Duyurular yükleniyor...</p>;
  if (error && !initialDataLoading) return <p style={styles.errorMessage}>Duyurular işlenirken hata: {error} <button onClick={() => setError(null)}>Kapat</button></p>;


  return (
    <div>
      <h3 style={headerStyle}>{isEditing ? "Duyuruyu Düzenle" : "Yeni Duyuru Ekle"}</h3>
      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Form Inputs */}
        <div style={inputGroupStyle}><label style={styles.formLabel}>Başlık</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} style={styles.input} required /></div>
        <div style={inputGroupStyle}><label style={styles.formLabel}>İçerik</label><textarea value={content} onChange={e => setContent(e.target.value)} style={{...styles.input, minHeight: '100px'}} required /></div>
        <div style={{display: 'flex', gap: '1rem'}}>
            <button type="submit" disabled={pageActionLoading} style={styles.formButtonPrimary(pageActionLoading)}> {pageActionLoading ? 'İşleniyor...' : (isEditing ? 'Güncelle' : 'Ekle')} </button>
            {isEditing && <button type="button" onClick={resetForm} style={{...styles.button, backgroundColor: '#718096'}}>İptal</button>}
        </div>
      </form>

      <h3 style={headerStyle}>Mevcut Duyurular</h3>
      {!initialDataLoading && announcements.length === 0 ? <p style={{ color: '#718096' }}>Duyuru bulunmamaktadır.</p> :
        (initialDataLoading && announcements.length === 0 ? <p>Duyurular yükleniyor...</p> :
            <ul style={{ listStyle: 'none', padding: 0 }}> {announcements.map(ann => ( 
                <li key={ann.id} style={styles.adminListItem}>
                    <div>
                        <p style={{fontWeight: 'bold'}}>{ann.title}</p>
                        <p style={{fontSize: '0.8em', color: '#718096'}}>{ann.content.substring(0,100)}{ann.content.length > 100 && "..."}</p>
                    </div>
                    <div style={styles.adminListItemActions}>
                        <button onClick={() => handleEdit(ann)} style={styles.adminActionButton('#ECC94B')} disabled={pageActionLoading}>Düzenle</button>
                        <button onClick={() => handleDelete(ann.id)} style={styles.adminActionButton('#F56565')} disabled={pageActionLoading}>Sil</button>
                    </div>
                </li> ))} 
            </ul>
        )
      }
    </div>
  );
}

function CartPage({ setCurrentPage }) { 
  const { cart, removeFromCart, updateCartQuantity, initialDataLoading, pageActionLoading, error, setError } = useData();
  const { currentUser } = useAuth(); 

  useEffect(() => {
    if(error) setError(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initialDataLoading && (!cart || cart.length === 0)) return <p style={styles.loadingMessage}>Sepet yükleniyor...</p>;
  
  if (!currentUser) { 
      return <p style={{...styles.textCenter, marginTop: '2rem'}}>Sepeti görüntülemek için lütfen giriş yapın.</p>;
  }
  if (currentUser.forcePasswordChange) {
      return <p style={{...styles.textCenter, marginTop: '2rem'}}>Sepetinizi görüntülemeden önce lütfen şifrenizi değiştirin.</p>;
  }
  if (error && !initialDataLoading) return <p style={styles.errorMessage}>Sepet yüklenirken hata: {error} <button onClick={() => setError(null)}>Kapat</button></p>;


  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (eventId, newQuantityString) => {
    setError(null);
    const newQuantity = parseInt(newQuantityString);
    if (isNaN(newQuantity)) return; 

    if (newQuantity === 0) { 
        if (window.confirm("Ürünü sepetten kaldırmak istediğinize emin misiniz?")) {
            removeFromCart(eventId);
        }
    } else if (newQuantity > 0) {
        updateCartQuantity(eventId, newQuantity);
    }
  };


  return (
    <div style={{...styles.formContainer, maxWidth: '700px'}}>
      <h2 style={{...styles.sectionTitle, borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem'}}>Sepetiniz</h2>
      {!initialDataLoading && cart.length === 0 ? (
        <p style={{ color: '#718096', textAlign: 'center' }}>Sepetinizde henüz etkinlik bulunmamaktadır.</p>
      ) : (
        (initialDataLoading && cart.length === 0) ? <p style={styles.loadingMessage}>Sepet yükleniyor...</p> :
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cart.map(item => (
              <li key={item.eventId || item.id} style={styles.cartItem}>
                <div style={styles.cartItemDetails}> 
                    <h3 style={{fontSize: '1.125rem', fontWeight: '500', color: '#2b6cb0'}}>{item.title}</h3> 
                    <p style={{fontSize: '0.875rem', color: '#a0aec0'}}>{item.price} TL x {item.quantity}</p> 
                </div>
                <div style={styles.cartItemActions}>
                   <input 
                     type="number" 
                     value={item.quantity} 
                     onChange={(e) => handleQuantityChange(item.eventId, e.target.value)} 
                     style={styles.quantityInput} 
                     min="0" 
                     disabled={pageActionLoading} />
                  <p style={{fontWeight: '600', width: '6rem', textAlign: 'right', marginRight: '0.5rem' }}>{(item.price * item.quantity).toFixed(2)} TL</p>
                  <button 
                    onClick={() => {
                        if (window.confirm("Bu ürünü sepetten kaldırmak istediğinize emin misiniz?")) {
                            setError(null); // Clear error before action
                            removeFromCart(item.eventId)
                        }
                    }} 
                    style={{ color: '#e53e3e', fontWeight: '600', fontSize: '0.875rem', opacity: pageActionLoading ? 0.5 : 1, background: 'none', border: 'none', cursor: 'pointer' }} 
                    disabled={pageActionLoading}> Kaldır 
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div style={{marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0'}}>
            <p style={styles.totalAmountText}>Toplam Tutar: {totalAmount.toFixed(2)} TL</p>
            <button 
              disabled={pageActionLoading || cart.length === 0} 
              onClick={() => alert('Ödeme simülasyonu: Siparişiniz alındı! (Gerçek bir ödeme sistemi entegre edilmemiştir.)')}
              style={{ ...styles.button, width: '100%', marginTop: '1rem', backgroundColor: '#48bb78', opacity: (pageActionLoading || cart.length === 0) ? 0.5 : 1, padding: '0.75rem 1rem', }}>
              Ödemeye Geç (Simülasyon)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;