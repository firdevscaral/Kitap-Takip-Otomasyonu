import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [kitaplar, setKitaplar] = useState([]);
  const [kitapAdi, setKitapAdi] = useState("");
  const [yazar, setYazar] = useState("");
  const [tur, setTur] = useState("");
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [secilenId, setSecilenId] = useState("");

  const kitaplarRef = collection(db, "kitaplar");

  const kitaplariGetir = async () => {
    try {
      const data = await getDocs(kitaplarRef);
      setKitaplar(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (hata) {
      console.error("Veri çekilemedi:", hata);
    }
  };

  useEffect(() => {
    kitaplariGetir();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!kitapAdi || !yazar || !tur) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    if (duzenlemeModu) {
      const kitapDoc = doc(db, "kitaplar", secilenId);
      await updateDoc(kitapDoc, { kitapAdi, yazar, tur });
      setDuzenlemeModu(false);
      setSecilenId("");
    } else {
      await addDoc(kitaplarRef, { kitapAdi, yazar, tur });
    }

    setKitapAdi("");
    setYazar("");
    setTur("");
    kitaplariGetir();
  };

  const kitapSil = async (id) => {
    if (window.confirm("Bu kitabı silmek istiyor musunuz?")) {
      await deleteDoc(doc(db, "kitaplar", id));
      kitaplariGetir();
    }
  };

  const duzenleModunuAc = (kitap) => {
    setDuzenlemeModu(true);
    setSecilenId(kitap.id);
    setKitapAdi(kitap.kitapAdi);
    setYazar(kitap.yazar);
    setTur(kitap.tur);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "750px" }}>
      <h2 className="text-center mb-4 text-dark fw-bold">Kitap Takip Otomasyonu</h2>
      
      <div className="card p-4 border shadow-sm mb-4 bg-light">
        <h5 className="card-title mb-3 fw-semibold">
          {duzenlemeModu ? "Kitap Bilgisi Güncelleme" : "Sisteme Yeni Kitap Ekle"}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Kitap Adı</label>
            <input type="text" className="form-control" value={kitapAdi} onChange={(e) => setKitapAdi(e.target.value)} placeholder="Kitabın adı..." />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Yazar</label>
            <input type="text" className="form-control" value={yazar} onChange={(e) => setYazar(e.target.value)} placeholder="Yazarın adı..." />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Kitap Türü</label>
            <input type="text" className="form-control" value={tur} onChange={(e) => setTur(e.target.value)} placeholder="Örn: Roman, Tarih..." />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-bold">
            {duzenlemeModu ? "Değişiklikleri Uygula" : "Kaydet ve Listele"}
          </button>
          {duzenlemeModu && (
            <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={() => { setDuzenlemeModu(false); setKitapAdi(""); setYazar(""); setTur(""); }}>
              İptal Et
            </button>
          )}
        </form>
      </div>

      <div className="card p-4 border shadow-sm bg-white">
        <h5 className="card-title mb-3 fw-semibold">Mevcut Kitap Listesi</h5>
        {kitaplar.length === 0 ? (
          <p className="text-muted text-center my-3">Kayıtlı kitap bulunamadı.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Kitap Adı</th>
                  <th>Yazar</th>
                  <th>Tür</th>
                  <th className="text-end">Yönetim</th>
                </tr>
              </thead>
              <tbody>
                {kitaplar.map((kitap) => (
                  <tr key={kitap.id}>
                    <td>{kitap.kitapAdi}</td>
                    <td>{kitap.yazar}</td>
                    <td><span className="badge bg-info text-dark">{kitap.tur}</span></td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-warning me-2" onClick={() => duzenleModunuAc(kitap)}>Düzenle</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => kitapSil(kitap.id)}>Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;