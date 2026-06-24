import {
  useEffect,
  useState
} from "react";

export default function AdminCustomers() {

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxrawDo75QKP1RwDwjjAKwoE0-so9UdTG2V4Dpq94PF8KOrMNx4CpfBEuNlk7VvblII/exec";

  const [customers,
    setCustomers] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

 const loadCustomers = async () => {
  try {

    const res = await fetch(
      `${SCRIPT_URL}?action=customers`
    );

    const data = await res.json();

    console.log("Customers:", data);

    setCustomers(data);

  } catch (err) {

    console.error(err);

  }
};

  useEffect(() => {
 console.log("Customers State:", customers);
    loadCustomers();

  }, []);

  const updateStatus =
    async (
      customerId,
      status
    ) => {

      await fetch(
        SCRIPT_URL,
        {
          method: "POST",
          body: JSON.stringify({
            action:
              "updateCustomerStatus",
            customerId,
            status
          })
        }
      );

      loadCustomers();

    };

 const filtered = customers.filter((c) => {

  const name =
    String(c.name || "")
      .toLowerCase();

  const phone =
    String(c.phone || "");

  return (
    name.includes(
      search.toLowerCase()
    ) ||
    phone.includes(search)
  );

});

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-5xl font-black text-green-700 mb-10">

        Customer Management

      </h1>

      <input
        placeholder="Search Customer"
        value={search}
        onChange={(e)=>
          setSearch(
            e.target.value
          )
        }
        className="border p-4 rounded-xl mb-6 w-full"
      />

      <div className="bg-white rounded-3xl p-8 shadow">

        <table className="w-full">

          <thead>

            <tr>

              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filtered.map(
              (customer) => (

                <tr
                  key={
                    customer.customerId
                  }
                >

                  <td>
                    {
                      customer.name
                    }
                  </td>

                  <td>
                    {
                      customer.phone
                    }
                  </td>

                  <td>
                    {
                      customer.address
                    }
                  </td>

                  <td>
                    {
                      customer.status
                    }
                  </td>

                  <td>

                    <button
                      onClick={() =>
                        updateStatus(
                          customer.customerId,
                          customer.status ===
                          "Active"
                            ? "Blocked"
                            : "Active"
                        )
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-xl"
                    >

                      {
                        customer.status ===
                        "Active"
                          ? "Block"
                          : "Activate"
                      }

                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}