/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteApiData, getApiData, updateApiData } from '../Services/api';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import Footer from '@/components/shared/Footer';
import base_url from '../baseUrl';

const FindResources = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sections, setSections] = useState([]);
  const [section, setSection] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const [form, setForm] = useState({
    titleLeft: '',
    titleHighlight: '',
    titleRight: '',
    subheading: '',
    bullets: [''],
    note: '',
    ctaText: '',
    ctaLink: '',
    image: null,
    previewImage: null,
    _id: null,
  });

  const fetchAll = async () => {
    try {
      const res = await getApiData('cms/get-find-resources');
      if (res?.success) setSections(res.data || []);
      else toast.error('Data not found');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Server error');
    }
  };

  const fetchById = async (sectionId) => {
    try {
      const res = await getApiData(`cms/get-find-resources/${sectionId}`);
      if (res?.success) setSection(res.data || null);
      else toast.error('Section not found');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Server error');
    }
  };

  useEffect(() => {
    if (id) fetchById(id);
    else fetchAll();
  }, [id]);

  useEffect(() => {
    if (section && id) {
      setShowEditForm(true);
      setForm({
        titleLeft: section.titleLeft || '',
        titleHighlight: section.titleHighlight || '',
        titleRight: section.titleRight || '',
        subheading: section.subheading || '',
        bullets: Array.isArray(section.bullets) ? section.bullets : [''],
        note: section.note || '',
        ctaText: section.ctaText || '',
        ctaLink: section.ctaLink || '',
        image: null,
        previewImage: section.image ? `${base_url}/${section.image}` : null,
        _id: section._id,
      });
    }
  }, [section, id]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm({ ...form, image: file, previewImage: URL.createObjectURL(file) });
  };

  const handleBulletChange = (index, value) => {
    const next = [...form.bullets];
    next[index] = value;
    setForm({ ...form, bullets: next });
  };

  const addBullet = () =>
    setForm({ ...form, bullets: [...form.bullets, ''] });

  const removeBullet = (index) => {
    const next = form.bullets.filter((_, i) => i !== index);
    setForm({ ...form, bullets: next.length ? next : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('titleLeft', form.titleLeft);
    fd.append('titleHighlight', form.titleHighlight);
    fd.append('titleRight', form.titleRight);
    fd.append('subheading', form.subheading);
    fd.append('bullets', JSON.stringify(form.bullets.filter(Boolean)));
    fd.append('note', form.note);
    fd.append('ctaText', form.ctaText);
    fd.append('ctaLink', form.ctaLink);
    fd.append('sectionId', form._id);
    if (form.image) fd.append('image', form.image);

    try {
      const res = await updateApiData('cms/update-find-resources', fd);
      if (res.success) {
        toast.success(res.message || 'Updated');
        navigate('/cms/find-resources');
      } else {
        toast.error(res.message || 'Update failed');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update failed');
    }
  };
  const handleDelete = async (deleteId) => {
    try {
      const res = await deleteApiData(`cms/delete-find-resources/${deleteId}`);
      if (res.success) {
        toast.success(res.message || 'Deleted');
        navigate('/cms/find-resources');
      } else toast.error(res.message || 'Delete failed');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <>
      <PageHeader />
      <div className="main-content">
        <div className="container-fluid">

          {!id && (
            <div className="card">
              <div className="card-header">
                <h5>All Consumer Free Resources</h5>
              </div>
              <div className="card-body table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>CTA</th>
                      <th>Image</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sections.length ? (
                      sections.map((s, i) => (
                        <tr key={s._id}>
                          <td>{i + 1}</td>
                          <td>{`${s.titleLeft} ${s.titleHighlight} ${s.titleRight}`}</td>
                          <td>{s.ctaText}</td>
                          <td>
                            {s.image && (
                              <img
                                src={`${base_url}/${s.image}`}
                                alt=""
                                style={{ height: 40, width: 80, objectFit: 'cover' }}
                              />
                            )}
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => navigate(`/cms/find-resources/${s._id}`)}
                              >
                                Open
                              </button>

                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(s._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {id && showEditForm && (
            <div className="card">
              <div className="card-header">
                <h5>Edit Section</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} className="row">

                  <div className="col-md-4 mb-3">
                    <label>Title Left</label>
                    <input className="form-control" value={form.titleLeft}
                      onChange={(e) => setForm({ ...form, titleLeft: e.target.value })} />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Title Highlight</label>
                    <input className="form-control" value={form.titleHighlight}
                      onChange={(e) => setForm({ ...form, titleHighlight: e.target.value })} />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Title Right</label>
                    <input className="form-control" value={form.titleRight}
                      onChange={(e) => setForm({ ...form, titleRight: e.target.value })} />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label>Subheading</label>
                    <input className="form-control" value={form.subheading}
                      onChange={(e) => setForm({ ...form, subheading: e.target.value })} />
                  </div>

                  <div className="col-md-12 mb-3">
                    <label>Bullets</label>
                    {form.bullets.map((b, i) => (
                      <div key={i} className="d-flex gap-2 mb-2">
                        <input className="form-control" value={b}
                          onChange={(e) => handleBulletChange(i, e.target.value)} />
                        <button type="button" className="btn btn-danger"
                          onClick={() => removeBullet(i)}>X</button>
                      </div>
                    ))}
                    <button type="button" className="btn btn-outline-primary"
                      onClick={addBullet}>Add Bullet</button>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>CTA Text</label>
                    <input className="form-control" value={form.ctaText}
                      onChange={(e) => setForm({ ...form, ctaText: e.target.value })} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>CTA Link</label>
                    <input className="form-control" value={form.ctaLink}
                      onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label>Image</label>
                    <input type="file" className="form-control" onChange={handleFile} />
                  </div>

                  <div className="col-md-6 mb-3">
                    {form.previewImage && (
                      <img src={form.previewImage} alt="" style={{ maxWidth: '100%' }} />
                    )}
                  </div>

                  <div className="col-12 d-flex gap-2">
                    <button type="submit" className="btn btn-primary">Save</button>
                    <button type="button" className="btn btn-secondary"
                      onClick={() => navigate('/cms/find-resources')}>
                      Cancel
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}
        </div>s
      </div>
      <Footer />
    </>
  );
};

export default FindResources;
