import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";

const API_URL = "/api/orders";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] =
    useState(null);
  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);

  const handleLogout = () => {
    sessionStorage.removeItem(
      "maram-admin-authenticated"
    );
    navigate("/admin/login", { replace: true });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch orders."
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while fetching orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");

      const response = await fetch(
        `${API_URL}/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order status."
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? data.order
            : order
        )
      );

      setSelectedOrder((currentOrder) =>
        currentOrder?._id === orderId
          ? data.order
          : currentOrder
      );
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong while updating the order."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString(
      "en-EG",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-EG"
    );
  };

  const getStatusClass = (status) => {
    return String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const getCustomerSearchText = (order) => {
    return [
      order._id,
      order.customer?.fullName,
      order.customer?.phone,
      order.customer?.governorate,
      order.customer?.city,
      order.customer?.address,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  };

  const filteredOrders = orders.filter(
    (order) => {
      const searchValue =
        search.toLowerCase().trim();

      if (!searchValue) {
        return true;
      }

      return getCustomerSearchText(
        order
      ).includes(searchValue);
    }
  );

  const pendingCount = orders.filter(
    (order) =>
      order.status === "Pending"
  ).length;

  const confirmedCount = orders.filter(
    (order) =>
      order.status === "Confirmed"
  ).length;

  const shippedCount = orders.filter(
    (order) =>
      order.status === "Shipped"
  ).length;

  const deliveredCount = orders.filter(
    (order) =>
      order.status === "Delivered"
  ).length;

  if (loading) {
    return (
      <div className="admin-products-page">
        <div className="admin-products-loading">
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products-page">

      <aside className="admin-products-sidebar">

        <div className="admin-products-brand">
          <div>MARAM</div>
          <span>ADMIN PANEL</span>
        </div>

        <nav className="admin-products-nav">

          <a
            href="/admin/orders"
            className="active"
          >
            <span>◫</span>
            Orders
          </a>

          <a href="/admin/products">
            <span>□</span>
            Products
          </a>

          <a href="#">
            <span>⌁</span>
            Shipping
          </a>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <span>↩</span>
            Logout
          </button>

        </nav>

      </aside>


      <main className="admin-products-main">

        <div className="admin-products-header">

          <div>
            <p className="admin-products-eyebrow">
              ORDERS
            </p>

            <h1>Orders</h1>

            <p>
              Manage your MARAM customer orders
            </p>
          </div>

          <button
            className="admin-add-product-button"
            onClick={fetchOrders}
          >
            ↻ Refresh
          </button>

        </div>


        {error && (
          <div className="admin-products-error">
            {error}
          </div>
        )}


        <section className="admin-products-stats">

          <div className="admin-product-stat">
            <span>Total Orders</span>
            <strong>
              {orders.length}
            </strong>
          </div>

          <div className="admin-product-stat">
            <span>Pending</span>
            <strong>
              {pendingCount}
            </strong>
          </div>

          <div className="admin-product-stat">
            <span>Confirmed</span>
            <strong>
              {confirmedCount}
            </strong>
          </div>

          <div className="admin-product-stat">
            <span>Shipped</span>
            <strong>
              {shippedCount}
            </strong>
          </div>

          <div className="admin-product-stat">
            <span>Delivered</span>
            <strong>
              {deliveredCount}
            </strong>
          </div>

        </section>


        <section className="admin-products-content">

          <div className="admin-products-toolbar">

            <div className="admin-products-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search orders, customers, phone..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="admin-products-count">
              {filteredOrders.length} orders
            </div>

          </div>


          {filteredOrders.length > 0 ? (
            <div className="admin-orders-list">

              {filteredOrders.map(
                (order) => (
                  <article
                    className="admin-product-card"
                    key={order._id}
                  >

                    <div className="admin-product-card-content">

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "flex-start",
                          gap: "20px",
                        }}
                      >

                        <div>

                          <div className="admin-product-category">
                            ORDER #
                            {String(
                              order._id
                            ).slice(-8)}
                          </div>

                          <h3>
                            {order.customer
                              ?.fullName ||
                              "Unknown Customer"}
                          </h3>

                          <p className="admin-product-arabic">
                            {order.customer
                              ?.phone || "-"}
                          </p>

                        </div>


                        <span
                          className={`admin-product-status ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status ||
                            "Pending"}
                        </span>

                      </div>


                      <div
                        style={{
                          marginTop: "18px",
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(2, minmax(0, 1fr))",
                          gap: "10px",
                        }}
                      >

                        <div>
                          <small>
                            Governorate
                          </small>

                          <div>
                            {order.customer
                              ?.governorate ||
                              "-"}
                          </div>
                        </div>


                        <div>
                          <small>
                            City
                          </small>

                          <div>
                            {order.customer
                              ?.city || "-"}
                          </div>
                        </div>


                        <div>
                          <small>
                            Items
                          </small>

                          <div>
                            {order.products
                              ?.reduce(
                                (
                                  total,
                                  item
                                ) =>
                                  total +
                                  Number(
                                    item.quantity ||
                                      0
                                  ),
                                0
                              ) || 0}
                          </div>
                        </div>


                        <div>
                          <small>
                            Date
                          </small>

                          <div>
                            {formatDate(
                              order.createdAt
                            )}
                          </div>
                        </div>

                      </div>


                      <div
                        style={{
                          marginTop: "18px",
                          paddingTop: "16px",
                          borderTop:
                            "1px solid rgba(0,0,0,0.08)",
                        }}
                      >

                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                          }}
                        >

                          <span>
                            Order Total
                          </span>

                          <strong>
                            EGP{" "}
                            {formatPrice(
                              order.total
                            )}
                          </strong>

                        </div>

                      </div>


                      <div
                        className="admin-product-actions"
                        style={{
                          marginTop: "18px",
                        }}
                      >

                        <button
                          className="admin-edit-product"
                          onClick={() =>
                            setSelectedOrder(
                              order
                            )
                          }
                        >
                          View Order
                        </button>


                        <select
                          value={
                            order.status ||
                            "Pending"
                          }
                          disabled={
                            updatingOrderId ===
                            order._id
                          }
                          onChange={(
                            event
                          ) =>
                            updateOrderStatus(
                              order._id,
                              event.target.value
                            )
                          }
                          style={{
                            flex: 1,
                            minHeight:
                              "42px",
                          }}
                        >

                          {ORDER_STATUSES.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            )
                          )}

                        </select>

                      </div>

                    </div>

                  </article>
                )
              )}

            </div>
          ) : (
            <div className="admin-products-empty">

              <div>◌</div>

              <h3>
                No orders found
              </h3>

              <p>
                New customer orders will
                appear here.
              </p>

            </div>
          )}

        </section>

      </main>


      {selectedOrder && (
        <div
          className="admin-product-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedOrder(null);
            }
          }}
        >

          <div className="admin-product-modal">

            <div className="admin-product-modal-header">

              <div>

                <span>
                  ORDER DETAILS
                </span>

                <h2>
                  Order #
                  {String(
                    selectedOrder._id
                  ).slice(-8)}
                </h2>

              </div>


              <button
                className="admin-modal-close"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                ×
              </button>

            </div>


            <div className="admin-product-form">

              <div
                style={{
                  display: "grid",
                  gap: "18px",
                }}
              >

                <div>

                  <strong>
                    Customer
                  </strong>

                  <p>
                    {
                      selectedOrder.customer
                        ?.fullName
                    }
                  </p>

                  <p>
                    {
                      selectedOrder.customer
                        ?.phone
                    }
                  </p>

                </div>


                <div>

                  <strong>
                    Delivery Address
                  </strong>

                  <p>
                    {
                      selectedOrder.customer
                        ?.governorate
                    }
                    {" - "}
                    {
                      selectedOrder.customer
                        ?.city
                    }
                  </p>

                  <p>
                    {
                      selectedOrder.customer
                        ?.address
                    }
                  </p>

                </div>


                {selectedOrder.customer
                  ?.notes && (
                  <div>

                    <strong>
                      Customer Notes
                    </strong>

                    <p>
                      {
                        selectedOrder
                          .customer
                          .notes
                      }
                    </p>

                  </div>
                )}


                <div>

                  <strong>
                    Order Status
                  </strong>

                  <select
                    value={
                      selectedOrder.status ||
                      "Pending"
                    }
                    disabled={
                      updatingOrderId ===
                      selectedOrder._id
                    }
                    onChange={(
                      event
                    ) =>
                      updateOrderStatus(
                        selectedOrder._id,
                        event.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      marginTop: "8px",
                    }}
                  >

                    {ORDER_STATUSES.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      )
                    )}

                  </select>

                </div>


                <div>

                  <strong>
                    Products
                  </strong>

                  <div
                    style={{
                      display: "grid",
                      gap: "12px",
                      marginTop: "12px",
                    }}
                  >

                    {selectedOrder.products?.map(
                      (item, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems:
                              "center",
                            padding:
                              "12px",
                            border:
                              "1px solid rgba(0,0,0,0.08)",
                          }}
                        >

                          {item.image && (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              style={{
                                width:
                                  "64px",
                                height:
                                  "80px",
                                objectFit:
                                  "cover",
                              }}
                            />
                          )}


                          <div
                            style={{
                              flex: 1,
                            }}
                          >

                            <strong>
                              {item.name}
                            </strong>

                            {item.size && (
                              <p>
                                Size:{" "}
                                {item.size}
                              </p>
                            )}

                            {item.color && (
                              <p>
                                Color:{" "}
                                {item.color}
                              </p>
                            )}

                            <p>
                              Qty:{" "}
                              {
                                item.quantity
                              }
                            </p>

                          </div>


                          <strong>
                            EGP{" "}
                            {formatPrice(
                              Number(
                                item.price
                              ) *
                                Number(
                                  item.quantity ||
                                    1
                                )
                            )}
                          </strong>

                        </div>
                      )
                    )}

                  </div>

                </div>


                <div
                  style={{
                    borderTop:
                      "1px solid rgba(0,0,0,0.1)",
                    paddingTop: "16px",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span>
                      Subtotal
                    </span>

                    <span>
                      EGP{" "}
                      {formatPrice(
                        selectedOrder.subtotal
                      )}
                    </span>
                  </div>


                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span>
                      Shipping
                    </span>

                    <span>
                      EGP{" "}
                      {formatPrice(
                        selectedOrder.shipping
                      )}
                    </span>
                  </div>


                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      fontSize: "18px",
                      fontWeight: "700",
                    }}
                  >
                    <span>
                      Total
                    </span>

                    <span>
                      EGP{" "}
                      {formatPrice(
                        selectedOrder.total
                      )}
                    </span>
                  </div>

                </div>


                <div>

                  <small>
                    Order Date
                  </small>

                  <p>
                    {formatDate(
                      selectedOrder.createdAt
                    )}
                  </p>

                </div>

              </div>


              <div className="admin-product-form-actions">

                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={() =>
                    setSelectedOrder(null)
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminOrders;